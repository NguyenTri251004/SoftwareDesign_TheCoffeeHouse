import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed.");
            }
        };

        if (token) verifyEmail();
    }, [token]);

    return (
        <div>
            <h2>Email Verification</h2>
            <p>{message}</p>
            <a href="/login">Go to Login</a>
        </div>
    );
};

export default VerifyEmail;