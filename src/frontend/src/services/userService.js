const BASE_URL = "http://localhost:5000/api/user/";

const userAPI = {
    getProfile: async () => {
        try {
            const response = await fetch(`${BASE_URL}profile`, {
                method: "GET",
                credentials: "include", 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to fetch profile");
            }

            return await response.json(); 
        } catch (error) {
            console.error("Error fetching profile:", error.message);
            throw error;
        }
    },
};

export default userAPI;
