import jwt from "jsonwebtoken";
import { Request } from "express";

interface DecodedPayload {
  id: string;
  role: string;
}

/**
 * Decodes a JWT token from a request or token string.
 * 
 * @param {string | Request} reqOrToken - Either a JWT token string or an Express request object
 * @returns {DecodedPayload | null} The decoded payload containing user ID and role, or null if decoding fails
 */
export default function decodeToken(reqOrToken: string | Request): DecodedPayload | null {
  try {
    let token: string | undefined;

    if (typeof reqOrToken === "string") {
      token = reqOrToken;
    } else if (
      reqOrToken.headers.authorization &&
      reqOrToken.headers.authorization.startsWith("Bearer ")
    ) {
      token = reqOrToken.headers.authorization.split(" ")[1];
    }

    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não definido");

    const decoded = jwt.verify(token, secret) as DecodedPayload;

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return null;
  }
}
