const API_URL = "http://localhost:5001/api";

const authProvider = {
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password }), 
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
    
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("shopId", data.shopId);

    
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }, 
    
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("shopId");
        return Promise.resolve();
    },
  
    checkAuth: () => {
        return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
    },

    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            return Promise.reject();
        }
        return Promise.resolve();
    },
  
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    },
  
    getProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) return Promise.reject();

        const response = await fetch(`${API_URL}/user/profile`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            return Promise.reject();
        }

        const profile = await response.json();
        return Promise.resolve({
            id: profile.id,
            fullName: profile.username || "profile.email",
            email: profile.email,
            avatar: profile.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
        });
    },

    sendForgotPasswordEmail: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        const data = await response.json();
        return data.token;
    },

    verifyResetCode: async (code) => {
        const token = localStorage.getItem("resetToken");
        const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, token }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        return true;
    },

    resetPassword: async (password) => {
        const token = localStorage.getItem("resetToken");
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, token }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        return true;
    },

    verifyEmail: async (token) => {
        const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`);

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        return true;
    },
};
  
export default authProvider;
  