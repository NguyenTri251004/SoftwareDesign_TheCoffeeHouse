import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Kiểm tra kết nối email có thành công không
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Nodemailer connection failed:", error);
    } else {
        console.log("✅ Nodemailer is ready to send emails!");
    }
});

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
    const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: '"The Coffee House" <no-reply@soundsoul.com>',
        to: email,
        subject: "Confirm Your Email Address",
        html: `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Confirm Your Email Address</h2>
        <p>Thank you for registering.</p>
        <p>Click the button below to confirm your email address:</p>
        <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
            Confirm Email
        </a>
        <p>This link will expire in 24 hours.</p>
    </div>
`,
    };

    await transporter.sendMail(mailOptions);
};

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log("📩 Incoming registration request:", req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hashedPassword,
            role: role || "customer",
            isVerified: false
        });

        await newUser.save();
        console.log("✅ User saved:", newUser);

        // Gửi email xác thực
        await sendVerificationEmail(email, verificationToken);
        console.log("📩 Verification email sent to:", email);

        res.status(201).json({ message: "User registered successfully. Please check your email." });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: "Invalid token." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(400).json({ message: "User not found." });

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
};
