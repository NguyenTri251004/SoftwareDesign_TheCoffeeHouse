const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CLIENT_URL.split(",");
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, 
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
