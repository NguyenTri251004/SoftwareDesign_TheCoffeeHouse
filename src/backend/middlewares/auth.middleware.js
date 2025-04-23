import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Không có token, truy cập bị từ chối" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ msg: "Token không hợp lệ" });
    }
};

// Giữ lại export mặc định để tương thích ngược
export default verifyToken;
