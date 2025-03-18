import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({ msg: "Invalid or expired token" });
    }
};

export default verifyToken;
