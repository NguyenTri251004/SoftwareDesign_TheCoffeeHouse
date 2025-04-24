import CartModel from "../models/cart.model.js";

const CartController = {
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await CartModel.findOne({ userId })
        .populate('items.productId', 'name') 
        .populate('items.toppings.toppingId', 'name'); 

      if (!cart) {
        return res.status(404).json({ success: false, message: "Chưa có giỏ hàng" });
      }

      const formattedCart = {
        ...cart._doc,
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name || 'Sản phẩm không xác định',
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          toppings: item.toppings.map((t) => ({
            toppingId: t.toppingId._id,
            name: t.toppingId.name || 'Topping không xác định',
            quantity: t.quantity,
          })),
        })),
      };

      return res.status(200).json({ success: true, data: formattedCart });
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
          items: [{
            productId: item.productId,
            name: item.name, 
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            toppings: item.toppings.map((t) => ({
              toppingId: t.toppingId,
              quantity: t.quantity || 1,
            })),
          }],
          totalPrice: item.totalPrice,
        });
      } else {
        const existingItem = cart.items.find(
          (existing) =>
            existing.productId.toString() === item.productId &&
            existing.size === item.size &&
            JSON.stringify(existing.toppings.map(t => ({ toppingId: t.toppingId, quantity: t.quantity }))) ===
            JSON.stringify(item.toppings.map(t => ({ toppingId: t.toppingId, quantity: t.quantity || 1 })))
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.totalPrice += item.totalPrice;
          cart.totalPrice += item.totalPrice;
        } else {
          cart.items.push({
            productId: item.productId,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            toppings: item.toppings.map((t) => ({
              toppingId: t.toppingId,
              quantity: t.quantity || 1,
            })),
          });
          cart.totalPrice += item.totalPrice;
        }
      }

      await cart.save();
      const populatedCart = await CartModel.findOne({ userId })
        .populate('items.productId', 'name')
        .populate('items.toppings.toppingId', 'name');

      const formattedCart = {
        ...populatedCart._doc,
        items: populatedCart.items.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name || 'Sản phẩm không xác định',
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          toppings: item.toppings.map((t) => ({
            toppingId: t.toppingId._id,
            name: t.toppingId.name || 'Topping không xác định',
            quantity: t.quantity,
          })),
        })),
      };

      return res.status(201).json({ success: true, data: formattedCart });
    } catch (error) {
      console.error("Lỗi addToCart:", error);
      return res.status(500).json({ success: false, message: "Lỗi khi thêm vào giỏ hàng", error });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { userId, itemIndex } = req.body;
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });
      }

      if (itemIndex === -1) {
        cart.items = [];
        cart.totalPrice = 0;
      } else {
        const item = cart.items[itemIndex];
        if (!item) {
          return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ" });
        }
        cart.totalPrice = Math.max(0, cart.totalPrice - item.totalPrice);
        cart.items.splice(itemIndex, 1);
      }

      await cart.save();
      const populatedCart = await CartModel.findOne({ userId })
        .populate('items.productId', 'name')
        .populate('items.toppings.toppingId', 'name');

      const formattedCart = populatedCart ? {
        ...populatedCart._doc,
        items: populatedCart.items.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name || 'Sản phẩm không xác định',
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          toppings: item.toppings.map((t) => ({
            toppingId: t.toppingId._id,
            name: t.toppingId.name || 'Topping không xác định',
            quantity: t.quantity,
          })),
        })),
      } : { userId, items: [], totalPrice: 0 };

      return res.status(200).json({ success: true, message: "Đã xóa sản phẩm", data: formattedCart });
    } catch (error) {
      console.error("Lỗi removeFromCart:", error);
      return res.status(500).json({ success: false, message: "Lỗi khi xóa khỏi giỏ hàng", error });
    }
  },
};

export default CartController;