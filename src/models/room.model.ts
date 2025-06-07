import mongoose, { Schema, Document } from "mongoose";
import { Room } from "../../shared/types/Room";

export interface RoomDocument extends Omit<Room, "_id" | "createdAt">, Document {}

const RoomSchema = new Schema<RoomDocument>(
  {
    name: { type: String, required: true, unique: true },
    isPrivate: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model<RoomDocument>("Room", RoomSchema);
