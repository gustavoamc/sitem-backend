import { Types } from "mongoose";

export interface Room {
  _id: string;
  name: string;
  isPrivate: boolean;
  owner: Types.ObjectId;
  participants: Types.ObjectId[]; // ou string[], se preferir serialização
  createdAt: string | Date;
  updatedAt?: string | Date;
}
