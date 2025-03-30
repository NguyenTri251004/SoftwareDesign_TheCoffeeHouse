import mongoose from "mongoose";
const { Schema } = mongoose;

const ToppingSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const Topping = mongoose.model("Topping", ToppingSchema);
export default Topping;
