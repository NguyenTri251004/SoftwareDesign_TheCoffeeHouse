import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Không có token, truy cập bị từ chối" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.userId,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ msg: "Token không hợp lệ" });
    }
};

export default authMiddleware;
