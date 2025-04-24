const BASE_URL = "http://localhost:5001/api/auth/";

const authAPI = {
  signup: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Sign up failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error during sign up:", error.message);
      throw error;
    }
  },

  login: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Logout failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  },
};
export default authAPI;
