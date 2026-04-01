import mongoose, { Schema, Document } from "mongoose";

export type ContactMessageStatus = "new" | "read" | "archived";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  category: string;
  message: string;
  status: ContactMessageStatus;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, maxlength: 320 },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    category: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 8000 },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ContactMessage = mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);
