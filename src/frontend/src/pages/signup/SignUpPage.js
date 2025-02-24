import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import authAPI from "../../services/authService";

import "./SignUpPage.css"

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.signup(formData); 
            dispatch(setUser(response.user));
            alert("Sign up successful!");
        } catch (error) {
            console.error("Sign up error:", error.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First name" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
