import mongoose, { Document, Schema } from "mongoose";
import { Log } from "../../shared/types/Log";

interface LogDocument extends Omit<Log, "_id" | "createdAt">, Document {}

const LogSchema = new Schema<LogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    ip:     { type: String, required: true },
  },
  { timestamps: true }
);

export const LogModel = mongoose.model<LogDocument>("Log", LogSchema);
