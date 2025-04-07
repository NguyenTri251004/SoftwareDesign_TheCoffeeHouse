import mongoose from "mongoose";
const { Schema } = mongoose;

const DrinkSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String },
    sizes: [
        {
            _id: false,
            size: { type: String, enum: ["S", "M", "L"], required: true },
            extraPrice: { type: Number, default: 0 }
        }
    ]
});

const Drink = mongoose.model("Drink", DrinkSchema);
export default Drink;
