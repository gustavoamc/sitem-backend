import { Types } from "mongoose";

export interface Message {
  _id: string;
  userId: Types.ObjectId;
  roomId: string;
  content: string;
  timestamp: string;
}
