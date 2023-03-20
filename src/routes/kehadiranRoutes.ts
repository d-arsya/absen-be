import express from "express";
import { absen, semuaKehadiran, tampilkanKode } from "../controllers/kehadiranController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/kode", authenticateJWT, allowRoles('admin'), tampilkanKode);
router.post("/", authenticateJWT, allowRoles('pegawai'), absen);
router.get("/", authenticateJWT, allowRoles('admin'), semuaKehadiran);

// Add more routes as needed

export default router;
