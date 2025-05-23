const BASE_URL = "http://localhost:5001/api";

const ShopAPI = {
    getCities: async() => {
        try {
            const response = await fetch(`${BASE_URL}/shop/cities`, {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch cities");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching cities:", error.message);
            throw error;
        }
    },

    getDistrictsByCity: async(city) => {
        try {
            const response = await fetch(`${BASE_URL}/shop/districts?city=${city}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch districts");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching districts:", error.message);
            throw error;
        }
    },

    getShopsByAddress: async(city) => {
        try {
            const response = await fetch(`${BASE_URL}/shop/shops?city=${city}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch shops");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching shops:", error.message);
            throw error;
        }
    },

    getShopById: async(id) => {
        try {
            const response = await fetch(`${BASE_URL}/shop/detail?id=${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch detail shop");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching detail shop:", error.message);
            throw error;
        }
    },

    getNearByShopById: async(id) => {
        try {
            const response = await fetch(`${BASE_URL}/shop/nearbyshops?id=${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch near by shop");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching near by shop:", error.message);
            throw error;
        }
    },

    getAddress: async() => {
        try {
            const response = await fetch(`${BASE_URL}/shop/address`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch address");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching address:", error.message);
            throw error;
        }
    },

    getShopNearestUser: async (address) => {
        try {
            const response = await fetch(
                `${BASE_URL}/shop/shop-nearest-user?address=${encodeURIComponent(address)}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch nearest shop");
            }
    
            return await response.json(); 
        } catch (error) {
            console.error("Error fetching nearest shop:", error.message);
            throw error;
        }
    },
    
}

export default ShopAPI;

