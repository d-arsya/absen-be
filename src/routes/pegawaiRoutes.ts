import express from "express";
import { tambahPegawai, semuaPegawai, login, profilSaya } from "../controllers/pegawaiController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, allowRoles('admin'), tambahPegawai);
router.get("/", authenticateJWT, allowRoles('admin'), semuaPegawai);
router.get("/profil", authenticateJWT, profilSaya)
router.post("/login", login);

// Add more routes as needed

export default router;
