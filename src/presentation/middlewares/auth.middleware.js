import JwtService from "../../infrastructure/security/jwt.service.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("TOKEN RECIBIDO:", token); 

        const payload = JwtService.verifyToken(token);

        req.user = payload;

        next();
    } catch (error) {
        console.error("ERROR TOKEN:", error.message); 
        return res.status(401).json({ error: "Invalid token" });
    }
};