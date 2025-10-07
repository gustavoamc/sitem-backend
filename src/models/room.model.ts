import mongoose, { Schema, Document } from "mongoose";
import { Room } from "../../shared/types/room";

export interface RoomDocument extends Omit<Room, "_id" | "createdAt">, Document {}

const RoomSchema = new Schema<RoomDocument>(
  {
    name: { type: String, required: true, unique: true },
    isPrivate: { type: Boolean, required: true, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model<RoomDocument>("Room", RoomSchema);
