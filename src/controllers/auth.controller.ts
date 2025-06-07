import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { createUserToken } from "../helpers/createUserToken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nickname, email, password } = req.body;

    if (!nickname || !email || !password) return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    
    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email já em uso." });

    if (password.length < 6) return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      nickname,
      email,
      password: hashedPassword,
    });

    const token = await createUserToken(user.id, req, res, "Usuário registrado com sucesso!");
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar", error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Todos os campos são obrigatórios." });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta." });

    //NOTED BEHAVIOUR
    // console.log(user._id); new ObjectId("683b4408773b84b76fbeeb77") //literal
    // console.log(user.id); 683b4408773b84b76fbeeb77 //mongoose getter for user._id.toString()

    const token = await createUserToken(user.id, req, res);
  } catch (err) {
    res.status(500).json({ message: "Erro ao logar", error: err });
  }
};
