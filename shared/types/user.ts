export type Role = "user" | "admin" | "root";

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt:  string | Date;
  updatedAt?: string | Date;
  role: Role;
  isBanned: boolean;
  banReason?: string;
  banUntil?: string; // ISO string para data futura
}
