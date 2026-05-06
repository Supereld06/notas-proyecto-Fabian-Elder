import jwt from "jsonwebtoken";

export default class JwtService {
    static generateToken(payload) {
        console.log("GENERANDO TOKEN CON SECRET:", process.env.JWT_SECRET); 
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });
    }

    static verifyToken(token) {
        try {
            console.log("VERIFICANDO TOKEN CON SECRET:", process.env.JWT_SECRET); 
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}