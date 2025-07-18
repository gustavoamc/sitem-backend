import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";

async function ensureRootExists() {
  const existingRoot = await UserModel.findOne({ role: "root" });
  if (existingRoot) {
    console.log("✅ Conta root já existe.");
    return;
  }

  const { ROOT_USERNAME, ROOT_EMAIL, ROOT_PASSWORD } = process.env;

  if (!ROOT_USERNAME || !ROOT_EMAIL || !ROOT_PASSWORD) {
    console.warn("⚠️ Variáveis do usuário root não configuradas no .env"); //make root route ?
    return;
  }

  const hashedPassword = await bcrypt.hash(ROOT_PASSWORD, 12);

  await UserModel.create({
    username: ROOT_USERNAME,
    email: ROOT_EMAIL,
    password: hashedPassword,
    role: "root",
  });

  console.log("✅ Conta root criada com sucesso.");
}

export default ensureRootExists;
