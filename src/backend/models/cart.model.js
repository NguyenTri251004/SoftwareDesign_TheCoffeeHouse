import mongoose from "mongoose";
const { Schema } = mongoose;

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Drink", required: true },
            size: { type: String, enum: ["S", "M", "L"], required: true },
            toppings: [
                {
                    toppingId: { type: Schema.Types.ObjectId, ref: "Topping", required: true },
                    quantity: { type: Number, default: 1, min: 1 }
                }
            ],
            quantity: { type: Number, required: true, min: 1 },
            unitPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

CartSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
