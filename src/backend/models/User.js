const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" }, 
    avatar: { type: String, default: "" }, 
    dateOfBirth: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },  
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
