import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["customer", "admin", "superAdmin"], default: "customer" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    avatar: { type: String, default: "" }
});

const User = mongoose.model("User", UserSchema);
export default User;