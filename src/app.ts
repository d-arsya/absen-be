import express from "express";
import mongoose from "mongoose";
import expressWs from 'express-ws';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import pegawaiRoutes from "./routes/pegawaiRoutes";
import kehadiranRoutes from "./routes/kehadiranRoutes";
import wsRoutes from './routes/wsRoutes';

dotenv.config();

const app = express();
expressWs(app)

app.use(cors());
app.use(morgan('combined'))
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Terhubung dengan MongoDB"))
  .catch((err) => console.log("Gagal terhubung dengan MongoDB:", err, MONGO_URI));

app.use("/api/pegawai", pegawaiRoutes);
app.use("/api/kehadiran", kehadiranRoutes);

wsRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
