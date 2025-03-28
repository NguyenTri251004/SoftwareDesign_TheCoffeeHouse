import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


// Kiểm tra kết nối email có thành công không
transporter.verify((error) => {
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
        from: '"The Coffee House" <no-reply@nhacaphe.com>',
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

        if (role === "admin") {
            const username = email.split("@")[0]; 

            const newAdmin = new Admin({
                _id: newUser._id,
                shopId: null, 
                username,
            });

            await newAdmin.save();
        }

        if (role === "customer") {
            // ...
        }

        // Gửi email xác thực
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "User registered successfully. Please check your email.", id: newUser._id });
    } catch (error) {
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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("📩 Incoming forgot password request:", req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Tạo mã 6 số
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Tạo JWT chứa email và code, hết hạn 15 phút
        const token = jwt.sign(
            { email, resetCode },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Gửi email
        const mailOptions = {
            from: '"The Coffee House" <no-reply@coffeehouse.com>',
            to: email,
            subject: "Password Reset Code",
            html: `
                <p>Your password reset code is:</p>
                <h3>${resetCode}</h3>
                <p>This code will expire in 15 minutes.</p>
            `,
        };

        console.log("📩 Sending password reset code:", resetCode);

        await transporter.sendMail(mailOptions);

        // Gửi token về frontend để frontend giữ lại
        res.status(200).json({ message: "Reset code sent to email.", token });
    } catch (error) {
        console.error("❌ Forgot password error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const verifyResetCode = (req, res) => {
    try {
        const { code, token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.resetCode !== code) {
            return res.status(400).json({ message: "Invalid code." });
        }

        res.status(200).json({ message: "Code verified." });
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
}