import express from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "API Buku Induk Sekolah berjalan",
  });
});


// ==========================================
// CRUD ENDPOINTS UNTUK STUDENTS
// ==========================================


// 1. GET /api/students
// Mengambil semua data siswa

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


// 2. GET /api/students/:id
// Mengambil satu data siswa

app.get("/api/students/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!student) {

      return res.status(404).json({
        message: "Siswa tidak ditemukan",
      });

    }

    res.json(student);

  } catch (error) {

    console.error(
      "Error mengambil data siswa by ID:",
      error
    );

    res.status(500).json({
      message: "Gagal mengambil data siswa",
    });

  }

});


// 3. POST /api/students
// Menambahkan siswa

app.post("/api/students", async (req, res) => {

  try {

    const newStudent = await prisma.student.create({
      data: req.body,
    });

    res.status(201).json(newStudent);

  } catch (error) {

    console.error(
      "Error menambah data siswa:",
      error
    );

    res.status(500).json({
      message: "Gagal menambahkan data siswa",
    });

  }

});


// 4. PUT /api/students/:id
// Mengupdate siswa

app.put("/api/students/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const updatedStudent =
      await prisma.student.update({

        where: {
          id: Number(id),
        },

        data: req.body,

      });

    res.json(updatedStudent);

  } catch (error) {

    console.error(
      "Error update data siswa:",
      error
    );

    res.status(500).json({
      message: "Gagal mengupdate data siswa",
    });

  }

});


// 5. DELETE /api/students/:id
// Menghapus siswa

app.delete("/api/students/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Data siswa berhasil dihapus",
    });

  } catch (error) {

    console.error(
      "Error hapus data siswa:",
      error
    );

    res.status(500).json({
      message: "Gagal menghapus data siswa",
    });

  }

});


// ==========================================
// CRUD ENDPOINTS UNTUK PARENTS
// ==========================================


// 1. GET /api/students/:studentId/parents
// Mengambil semua orang tua/wali

app.get(
  "/api/students/:studentId/parents",
  async (req, res) => {

    const { studentId } = req.params;

    try {

      const parents =
        await prisma.parent.findMany({

          where: {
            studentId: Number(studentId),
          },

          orderBy: {
            createdAt: "asc",
          },

        });

      res.json(parents);

    } catch (error) {

      console.error(
        "Error mengambil data orang tua/wali:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengambil data orang tua/wali",
      });

    }

  }
);


// 2. GET /api/parents/:id
// Mengambil satu orang tua/wali

app.get("/api/parents/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const parent =
      await prisma.parent.findUnique({

        where: {
          id: Number(id),
        },

      });

    if (!parent) {

      return res.status(404).json({
        message:
          "Data orang tua/wali tidak ditemukan",
      });

    }

    res.json(parent);

  } catch (error) {

    console.error(
      "Error mengambil data orang tua/wali:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data orang tua/wali",
    });

  }

});


// 3. POST /api/students/:studentId/parents
// Menambahkan orang tua/wali

app.post(
  "/api/students/:studentId/parents",
  async (req, res) => {

    const { studentId } = req.params;

    try {

      const newParent =
        await prisma.parent.create({

          data: {

            studentId: Number(studentId),

            relation: req.body.relation,

            name: req.body.name,

            nik:
              req.body.nik || null,

            birthPlace:
              req.body.birthPlace || null,

            birthDate:
              req.body.birthDate
                ? new Date(req.body.birthDate)
                : null,

            education:
              req.body.education || null,

            occupation:
              req.body.occupation || null,

            income:
              req.body.income || null,

            phone:
              req.body.phone || null,

            address:
              req.body.address || null,

          },

        });

      res.status(201).json(newParent);

    } catch (error) {

      console.error(
        "Error menambah data orang tua/wali:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menambahkan data orang tua/wali",
      });

    }

  }
);


// 4. PUT /api/parents/:id
// Mengupdate orang tua/wali

app.put("/api/parents/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const updatedParent =
      await prisma.parent.update({

        where: {
          id: Number(id),
        },

        data: {

          relation: req.body.relation,

          name: req.body.name,

          nik:
            req.body.nik || null,

          birthPlace:
            req.body.birthPlace || null,

          birthDate:
            req.body.birthDate
              ? new Date(req.body.birthDate)
              : null,

          education:
            req.body.education || null,

          occupation:
            req.body.occupation || null,

          income:
            req.body.income || null,

          phone:
            req.body.phone || null,

          address:
            req.body.address || null,

        },

      });

    res.json(updatedParent);

  } catch (error) {

    console.error(
      "Error update data orang tua/wali:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengupdate data orang tua/wali",
    });

  }

});


// 5. DELETE /api/parents/:id
// Menghapus orang tua/wali

app.delete("/api/parents/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await prisma.parent.delete({

      where: {
        id: Number(id),
      },

    });

    res.json({
      message:
        "Data orang tua/wali berhasil dihapus",
    });

  } catch (error) {

    console.error(
      "Error hapus data orang tua/wali:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus data orang tua/wali",
    });

  }

});


// ==========================================
// CRUD ENDPOINTS UNTUK EDUCATION
// ==========================================


// 1. GET /api/students/:studentId/education
// Mengambil data pendidikan siswa

app.get(
  "/api/students/:studentId/education",
  async (req, res) => {

    const { studentId } = req.params;

    try {

      const education =
        await prisma.education.findUnique({

          where: {
            studentId: Number(studentId),
          },

        });

      if (!education) {

        return res.status(404).json({
          message:
            "Data pendidikan belum tersedia",
        });

      }

      res.json(education);

    } catch (error) {

      console.error(
        "Error mengambil data pendidikan:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengambil data pendidikan",
      });

    }

  }
);


// 2. GET /api/education/:id
// Mengambil satu data pendidikan berdasarkan ID

app.get("/api/education/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const education =
      await prisma.education.findUnique({

        where: {
          id: Number(id),
        },

      });

    if (!education) {

      return res.status(404).json({
        message:
          "Data pendidikan tidak ditemukan",
      });

    }

    res.json(education);

  } catch (error) {

    console.error(
      "Error mengambil data pendidikan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data pendidikan",
    });

  }

});


// 3. POST /api/students/:studentId/education
// Menambahkan data pendidikan
app.post(
  "/api/students/:studentId/education",
  async (req, res) => {

    const { studentId } = req.params;

    try {

      const education =
        await prisma.education.create({

          data: {

            studentId: Number(studentId),

            schoolOrigin:
              req.body.schoolOrigin || null,

            nisOrigin:
              req.body.nisOrigin || null,

            yearEntry:
              req.body.yearEntry
                ? Number(req.body.yearEntry)
                : null,

            className:
              req.body.className || null,

            major:
              req.body.major || null,

            status:
              req.body.status || "ACTIVE",

          },

        });

      res.status(201).json(education);

    } catch (error) {

      console.error(
        "Error menambah data pendidikan:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menambahkan data pendidikan",
      });

    }

  }
);


// 4. PUT /api/education/:id
// Mengupdate data pendidikan

app.put("/api/education/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const updatedEducation =
      await prisma.education.update({

        where: {
          id: Number(id),
        },

        data: {

          schoolOrigin:
            req.body.schoolOrigin || null,

          nisOrigin:
            req.body.nisOrigin || null,

          yearEntry:
            req.body.yearEntry
              ? Number(req.body.yearEntry)
              : null,

          className:
            req.body.className || null,

          major:
            req.body.major || null,

          status:
            req.body.status || "ACTIVE",

        },

      });

    res.json(updatedEducation);

  } catch (error) {

    console.error(
      "Error update data pendidikan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengupdate data pendidikan",
    });

  }

});


// 5. DELETE /api/education/:id
// Menghapus data pendidikan

app.delete("/api/education/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await prisma.education.delete({

      where: {
        id: Number(id),
      },

    });

    res.json({
      message:
        "Data pendidikan berhasil dihapus",
    });

  } catch (error) {

    console.error(
      "Error hapus data pendidikan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus data pendidikan",
    });

  }

});


export default app;