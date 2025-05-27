import { Types } from "mongoose";

export interface Room {
  _id: string;
  name: string;
  isPrivate: boolean;
  participants: Types.ObjectId[]; // ou string[], se preferir serialização
  createdAt: string;
}
