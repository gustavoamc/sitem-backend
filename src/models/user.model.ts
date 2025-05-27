import mongoose, { Document, Schema } from "mongoose";
import { User } from "../../shared/types/user";

interface UserDocument extends Omit<User, "_id" | "createdAt">, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    nickname: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
