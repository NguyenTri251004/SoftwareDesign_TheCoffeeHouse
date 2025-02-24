const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const authController = {
    signup: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại!" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone: "",  
                avatar: "", 
                dateOfBirth: null
            });
        
            await newUser.save();
            
            // await sendVerificationEmail(email, verificationToken);
        
            res.status(201).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email." });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) return res.status(400).json({ msg: "Email chưa được đăng ký." });
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không chính xác." });
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", 
                sameSite: "Strict",
                maxAge: 60 * 60 * 1000, 
            });
    
            res.json({ msg: "Login successful", user: user });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = authController;
