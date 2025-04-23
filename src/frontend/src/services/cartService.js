const BASE_URL = "http://localhost:5001/api";

const CartAPI = {
    getCartByUserId: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/cart/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy giỏ hàng");
            }

            const res = await response.json();
            return res.data;
        } catch (error) {
            console.error("Error fetching cart:", error.message);
            throw error;
        }
    },

    addToCart: async (cartData) => {
        try {
            const response = await fetch(`${BASE_URL}/cart/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể thêm vào giỏ hàng");
            }

            const res = await response.json();
            return res.data;
        } catch (error) {
            console.error("Error adding to cart:", error.message);
            throw error;
        }
    },

    removeFromCart: async (userId, itemIndex) => {
        try {
            const response = await fetch(`${BASE_URL}/cart/remove`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, itemIndex }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể xoá sản phẩm khỏi giỏ");
            }

            const res = await response.json();
            return res.data;
        } catch (error) {
            console.error("Error removing from cart:", error.message);
            throw error;
        }
    }
};

export default CartAPI;