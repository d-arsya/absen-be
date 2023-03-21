import express from "express";
import { tambahPegawai, semuaPegawai, login, profil } from "../controllers/pegawaiController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, allowRoles('admin'), tambahPegawai);
router.get("/", authenticateJWT, allowRoles('admin'), semuaPegawai);
router.get("/profil", authenticateJWT, profil)
router.post("/login", login);

// Add more routes as needed

export default router;
