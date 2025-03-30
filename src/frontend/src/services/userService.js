const BASE_URL = "http://localhost:5001/api/user/";

const userAPI = {
    getProfile: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}profile`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json(); 

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch profile");
            }

            console.log("Dữ liệu profile:", data);
            return data;
        } catch (error) {
            console.error("Error fetching profile:", error.message);
            throw error;
        }
    },
};


export default userAPI;
