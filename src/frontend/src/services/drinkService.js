const BASE_URL = "http://localhost:5001/api";

const DrinkAPI = {
    getMenuByShopId: async (shopId) => {
        try {
            const response = await fetch(`${BASE_URL}/product/shop/${shopId}/menu`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch menu by shop");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching menu by shop:", error.message);
            throw error;
        }
    },

    getDrinkById: async (shopId, drinkId) => {
        try {
            const response = await fetch(`${BASE_URL}/product/shop/${shopId}/product/${drinkId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không tìm thấy sản phẩm");
            }

            const res = await response.json();
            return { drink: res.data };
        } catch (error) {
            console.error("Error fetching drink detail:", error.message);
            throw error;
        }
    },
};

export default DrinkAPI;