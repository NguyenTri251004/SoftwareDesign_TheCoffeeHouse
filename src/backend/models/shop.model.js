import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { 
        detail: { type: String, required: true },
        district: { type: String, required: true }, 
        city: { type: String, required: true },
    },
    phone: { type: String },
    images: { type: [String] },
    products: { type: [String], default: [] },
    openingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
    },
    carParking: { type: Boolean, default: false },
    takeAway: { type: Boolean, default: false },
    service: { type: Boolean, default: false },
    description: { type: String, default: "" }
});

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
