import mongoose, { Schema, Document } from "mongoose";

export interface IPegawai extends Document {
  nama: string;
  email: string;
  password: string;
  role: "pegawai" | "admin";
}

const skemaPegawai: Schema = new Schema({
  nama: { type: String, required: true, index: 'text' },
  email: { type: String, required: true, unique: true, index: 'text' },
  password: { type: String, required: true },
  role: { type: String, enum: ["pegawai", "admin"], default: "pegawai" },
});

export default mongoose.model<IPegawai>("Pegawai", skemaPegawai, 'pegawai');
