import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 }
});
  
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;