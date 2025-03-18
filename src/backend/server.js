
import authRoute from "./routes/auth.route.js"; // Đảm bảo đường dẫn đúng!
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

// const userRoute = require("./routes/user.route");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

console.log("📌 EMAIL_PASS:", process.env.EMAIL_PASS);

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));