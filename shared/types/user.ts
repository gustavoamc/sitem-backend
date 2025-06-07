export type Role = "user" | "admin" | "root";

export interface User {
  _id: string;
  nickname: string;
  email: string;
  password: string;
  createdAt: string;
  role: Role;
  isBanned: boolean;
  banReason?: string;
  banUntil?: string; // ISO string para data futura
}
