import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/auth.route.js"; 
import shopRoute from "./routes/shop.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

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
    exposedHeaders: ["X-Total-Count"],
}));
app.use(express.json({ limit: '20mb' })); 
app.use(express.urlencoded({ limit: '20mb', extended: true }));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/shop", shopRoute);
app.use("/api/admin", adminRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));