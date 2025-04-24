import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, 
        default: null, 
      },
    userName: {
        type: String,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    statusTimes: {
        type: Map,
        of: Date,
        default: () => new Map([['pending', new Date()]])
    },
    cancelReason: {
        type: String,
        default: ''
    },
    refundStatus: {
        type: String,
        enum: ['None', 'Partial', 'Full'],
        default: 'None'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'vnpay', 'momo', 'zalopay', 'shopeepay', 'card'],
        default: 'cash'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            size: {
                type: String,
                enum: ['S', 'M', 'L'],
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: 1
            },
            unitPrice: {
                type: Number,
                required: true,
                min: 0
            },
            totalPrice: {
                type: Number,
                required: true,
                min: 0
            },
            topping: [
                {
                    toppingId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Topping',
                        required: true
                    },
                }
            ]
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    }
});

OrderSchema.index({ userId: 1, status: 1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;