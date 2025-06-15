import { Request } from "express";
import { UserModel, UserDocument } from "../models/user.model";
import verifyToken from "./verifyToken";

export const getUserByToken = async (req: Request | string): Promise<UserDocument | null> => {
  try {
    const decoded = verifyToken(req);

    const user = await UserModel.findById(decoded?.id);
    return user;
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return null;
  }
};
