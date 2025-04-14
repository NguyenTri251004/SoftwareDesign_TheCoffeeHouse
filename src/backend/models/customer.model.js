import mongoose from "mongoose";
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    fullname: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 },
    addresses: [
        {
            id: { type: Number, required: true },
            address: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
});

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;