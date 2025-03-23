import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Verify.css";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setMessage("Invalid verification link.");
            return;
        }
    
        const verifyEmail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5001/api/auth/verify-email?token=${token}`);
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed.");
            } finally {
                setLoading(false);
            }
        };
    
        verifyEmail();
        console.error("❌ Verification error:", error);
    }, [token]);

    return (
        <>
            <div className="verify-container">
                <div className="verify-box">
                    <h2>Email Verification</h2>
                    <p>{message}</p>
                    <a href="/login">Go to Login</a>
                </div>
                <div className="image-section" >
                    <h1>THE COFFEE HOUSE</h1>
                </div>
            </div>
        </>
        
    );
};

export default VerifyEmail;