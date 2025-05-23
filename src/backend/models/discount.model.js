import mongoose from "mongoose";
const { Schema } = mongoose;

const DiscountSchema = new Schema({
  shopId: { type: Schema.Types.ObjectId, ref: "Shop", default: null }, // null = all shop
  userId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // null = voucher chung
  code: { type: String, required: true, unique: true, trim: true },
  description: {
    type: String,
    default: function () {
      return this.isPercentage
        ? `Giảm ${
            this.discountAmount
          }% cho đơn từ ${this.minOrderValue.toLocaleString()}đ`
        : `Giảm ${this.discountAmount.toLocaleString()}đ cho đơn từ ${this.minOrderValue.toLocaleString()}đ`;
    },
    trim: true,
    maxlength: 255,
  },
  detail: { type: String, default: "", trim: true },
  isPercentage: { type: Boolean, required: true }, // true: %, false: tiền
  discountAmount: { type: Number, required: true },
  freeShip: { type: Boolean, default: false },
  minOrderValue: { type: Number, default: 0 },
  expiryDate: { type: Date },
  maxUsage: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  icon: { type: String, default: "" },
});

const Discount = mongoose.model("Discount", DiscountSchema);
export default Discount;
