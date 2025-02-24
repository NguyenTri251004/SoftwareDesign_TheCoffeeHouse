import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import authAPI from "../../services/authService";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(formData); 
            dispatch(setUser(response.user)); 
            navigate("/"); 
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mb-2"
                    />
                    <button type="submit" className="bg-blue-500 w-full p-2 text-white">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
