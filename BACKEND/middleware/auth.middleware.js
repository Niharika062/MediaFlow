import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // fix here
        next();
    } 
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifyToken;