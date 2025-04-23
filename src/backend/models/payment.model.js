// /Users/thanhthuy/Documents/SoftwareDesign_TheCoffeeHouse/src/backend/models/payment.model.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    provider: {
        type: String,
        enum: ['momo', 'vnpay', 'zalopay', 'shopeepay', 'card', 'cash'],
        required: true
    },
    transactionId: {
        type: String
    },
    momoOrderId: {
        type: String,
    },
    payUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'expired', 'refunded'],
        default: 'pending'
    },
    errorMessage: {
        type: String
    },
    responseDetails: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;