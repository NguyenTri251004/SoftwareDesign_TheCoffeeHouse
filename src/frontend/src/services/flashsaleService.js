const BASE_URL = "http://localhost:5001/api";

const FlashSaleAPI = {
    getFlashSalesByShop: async (shopId) => {
        try {
            const response = await fetch(`${BASE_URL}/flashsale/shop-detail/${shopId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch flash sales");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching flash sales by shop:", error.message);
            throw error;
        }
    }
};

export default FlashSaleAPI;
