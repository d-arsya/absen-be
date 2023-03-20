import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Pegawai from "../models/pegawai";
import { broadcast } from "../routes/wsRoutes";

const tambahData = async (nama: string, email: string, password: string, role: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordTerenkripsi = await bcrypt.hash(password, salt);

  // Membuat pegawai baru
  const pegawaiBaru = new Pegawai({ nama, email, password: passwordTerenkripsi, role });

  // Menyimpan pegawai baru ke database
  await pegawaiBaru.save();
  return pegawaiBaru
}

export const tambahPegawai = async (req: Request, res: Response) => {
  const { nama, email, password, role } = req.body;

  // Validasi data yang diterima dari request
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama, email dan password harus disertakan" });
  }

  try {
    // Mengecek apakah email sudah ada dalam database
    const cekEmail = await Pegawai.findOne({ email });
    if (cekEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Membuat pegawai baru
    const pegawaiBaru = await tambahData(nama, email, password, role)

    broadcast("Pegawai")
    // Mengirimkan response dengan pegawai yang baru dibuat
    res.status(201).json(pegawaiBaru);
  } catch (error) {
    console.error("Gagal menambahkan pegawai:", error);
    res.status(500).json({ message: "Gagal menambahkan pegawai" });
  }
};

export const semuaPegawai = async (req: Request, res: Response) => {
  try {
    // Ambil halaman dari query parameter atau gunakan 1 sebagai default
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    // Menghitung jumlah total dokumen untuk menghitung jumlah halaman
    const totalDocuments = await Pegawai.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    // Mengambil pegawai dari database menggunakan pagination dan mengurutkan berdasarkan tanggal secara descending
    const dataPegawai = await Pegawai.find({}, { _id: 0, password: 0, __v: 0 })
      .sort({ nama: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mengirimkan response dengan daftar pegawai, halaman saat ini, dan jumlah halaman
    res.status(200).json({ data: dataPegawai, halaman: page, totalHalaman: totalPages });
  } catch (error) {
    console.error("Gagal mengambil data pegawai:", error);
    res.status(500).json({ message: "Gagal mengambil data pegawai" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let pegawai = await Pegawai.findOne({ email });
    if (!pegawai) {
      if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASS) {
        pegawai = await tambahData(email, email, password, 'admin')
      } else {
        return res.status(400).json({ message: "Email atau password salah" });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, pegawai.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: pegawai._id, role: pegawai.role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1w",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mencoba login" });
  }
};

export const profilSaya = async (req: Request, res: Response) => {
  try {
    // Mencari pegawai berdasarkan ID
    const pegawai = await Pegawai.findById(req.user.id, { _id: 0, password: 0, __v: 0 });

    if (!pegawai) {
      // Jika pegawai tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    return res.status(200).json({ data: pegawai })
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
}