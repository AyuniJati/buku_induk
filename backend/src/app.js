import express from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Buku Induk Sekolah berjalan",
  });
});

// ==========================================
// CRUD ENDPOINTS UNTUK STUDENTS
// ==========================================

// 1. GET /api/students - Mengambil semua data siswa (dari terbaru)
app.get("/api/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(students);
  } catch (error) {
    console.error("Error mengambil data siswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data siswa",
    });
  }
});

// 2. GET /api/students/:id - Mengambil data siswa berdasarkan ID
app.get("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });
    if (!student) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error mengambil data siswa by ID:", error);
    res.status(500).json({ message: "Gagal mengambil data siswa" });
  }
});

// 3. POST /api/students - Menambahkan data siswa baru
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await prisma.student.create({
      data: req.body,
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error menambah data siswa:", error);
    res.status(500).json({ message: "Gagal menambahkan data siswa" });
  }
});

// 4. PUT /api/students/:id - Mengupdate data siswa
app.put("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updatedStudent);
  } catch (error) {
    console.error("Error update data siswa:", error);
    res.status(500).json({ message: "Gagal mengupdate data siswa" });
  }
});

// 5. DELETE /api/students/:id - Menghapus data siswa
app.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Data siswa berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus data siswa:", error);
    res.status(500).json({ message: "Gagal menghapus data siswa" });
  }
});

export default app;