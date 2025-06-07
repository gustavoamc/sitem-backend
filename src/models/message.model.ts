import mongoose, { Document, Schema } from "mongoose";
import { Message } from "../../shared/types/Message";

export interface MessageDocument extends Omit<Message, "_id" | "timestamp">, Document {}

const MessageSchema = new Schema<MessageDocument>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId:   { type: String, required: true },
    content:  { type: String, required: true },
  },
  { timestamps: { createdAt: "timestamp" } }
);

export const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);
