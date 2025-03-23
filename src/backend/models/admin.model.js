import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    username: { type: String, required: true }
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;