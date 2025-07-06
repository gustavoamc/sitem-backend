import { Request } from "express";
import { UserModel, UserDocument } from "../models/user.model";
import verifyToken from "./verifyToken";

export const getUserByToken = async (req: Request | string): Promise<UserDocument | null> => {
  
  const decoded = verifyToken(req);

  const user = await UserModel.findById(decoded?.id);
  return user;

};
