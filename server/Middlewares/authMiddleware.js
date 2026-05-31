import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'testsecret');
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};
