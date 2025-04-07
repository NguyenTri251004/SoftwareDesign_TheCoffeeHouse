import mongoose from "mongoose";
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    fullname: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 }
});

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;