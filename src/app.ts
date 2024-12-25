import express, { Request, Response } from "express";
import mongoose from "mongoose";
import expressWs from "express-ws";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rutePegawai from "./routes/rutePegawai";
import ruteKehadiran from "./routes/ruteKehadiran";
import ruteWs from "./routes/ruteWs";

dotenv.config();

const app = express();
app.get("/", (req: Request, res: Response) => {
  return res.send(200, { data: "ok" });
});
expressWs(app);

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/pegawai", rutePegawai);
app.use("/api/kehadiran", ruteKehadiran);

ruteWs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Terhubung dengan MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("Gagal terhubung dengan MongoDB:", err);
//   });
