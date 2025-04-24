import mongoose from "mongoose";
const { Schema } = mongoose;

const FlashSaleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, required: true, ref: "Drink" },
            discountPercentage: { type: Number, required: true, min: 0, max: 100 },
            stock: { type: Number, required: true, min: 0 },
            maxQuantityPerCustomer: { type: Number, required: true, min: 1 },
        }
    ],
    status: {
        type: String,
        enum: ["Upcoming", "Active", "Ended"],
        default: "Upcoming"
    },
    createdAt: { type: Date, default: Date.now }
});

const FlashSale = mongoose.model("FlashSale", FlashSaleSchema);
export default FlashSale;
