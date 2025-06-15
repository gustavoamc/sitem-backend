import mongoose, { Document, Schema } from "mongoose";
import { User } from "../../shared/types/User";

export interface UserDocument extends Omit<User, "_id" | "createdAt">, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    nickname: { type: String, required: true }, //TODO: resolve if it's necessary to have a unique nickname
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["user", "admin", "root"], default: "user" },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    banUntil:  { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
