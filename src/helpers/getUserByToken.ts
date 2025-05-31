import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserModel, UserDocument } from "../models/user.model";
import { getToken } from "./getToken";

interface JwtPayloadWithId {
  id: string;
}

export const getUserByToken = async (req: Request): Promise<UserDocument | null> => {
  const token = getToken(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadWithId;

    const user = await UserModel.findById(decoded.id).select("-password");
    return user;
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return null;
  }
};
