import CartModel from "../models/cart.model.js";

const CartController = {
    getCart: async (req, res) => {
        try {
            const { userId } = req.params;
            const cart = await CartModel.findOne({ userId });
            if (!cart) return res.status(404).json({ success: false, message: "Chưa có giỏ hàng" });

            return res.status(200).json({ success: true, data: cart });
        } catch (error) {
            console.error("Lỗi getCart:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy giỏ hàng", error });
        }
    },

    addToCart: async (req, res) => {
        try {
            const { userId, item } = req.body;
    
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                cart = new CartModel({
                    userId,
                    items: [item],
                    totalPrice: item.totalPrice
                });
            } else {
                const existingItem = cart.items.find(existing =>
                    existing.productId.toString() === item.productId &&
                    existing.size === item.size &&
                    JSON.stringify(existing.toppings) === JSON.stringify(item.toppings)
                );
    
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                    existingItem.totalPrice += item.totalPrice;
                } else {
                    cart.items.push(item);
                }
    
                cart.totalPrice += item.totalPrice;
            }
    
            await cart.save();
            return res.status(201).json({ success: true, data: cart });
        } catch (error) {
            console.error("Lỗi addToCart:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi thêm vào giỏ hàng", error });
        }
    },
    
    removeFromCart: async (req, res) => {
        try {
            const { userId, itemIndex } = req.body; 
            const cart = await CartModel.findOne({ userId });
            if (!cart) return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });

            const item = cart.items[itemIndex];
            if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ" });

            cart.totalPrice -= item.totalPrice;
            cart.items.splice(itemIndex, 1);
            await cart.save();

            return res.status(200).json({ success: true, message: "Đã xoá sản phẩm", data: cart });
        } catch (error) {
            console.error("Lỗi removeFromCart:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi xoá khỏi giỏ hàng", error });
        }
    }
};

export default CartController;
