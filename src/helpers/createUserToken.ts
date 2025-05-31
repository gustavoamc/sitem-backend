import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const createUserToken = async (
  userId: string,
  req: Request,
  res: Response,
  message?: string
): Promise<void> => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: message ?? "Autenticado com sucesso!",
    token
  });
};
