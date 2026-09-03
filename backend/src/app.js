import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";
import authMiddleware from "./middleware/authMiddleware.js";

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

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Akun tidak aktif",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error login:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan saat login",
    });
  }
});
// ==========================================
// AUTHENTICATION MIDDLEWARE
// Semua API setelah bagian ini membutuhkan JWT
// ==========================================

app.use("/api", authMiddleware);

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

// STUDENT DEVELOPMENT

// 1. Get all student developments
app.get("/api/students/:studentId/developments", async (req, res) => {
  const { studentId } = req.params;

  try {
    const developments = await prisma.studentDevelopment.findMany({
      where: {
        studentId: Number(studentId),
      },
      orderBy: [
        { academicYear: "desc" },
        { semester: "desc" },
      ],
    });

    res.json(developments);
  } catch (error) {
    console.error("Error mengambil data perkembangan siswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data perkembangan siswa",
    });
  }
});

// 2. Get development by ID
app.get("/api/developments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const development = await prisma.studentDevelopment.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!development) {
      return res.status(404).json({
        message: "Data perkembangan siswa tidak ditemukan",
      });
    }

    res.json(development);
  } catch (error) {
    console.error("Error mengambil detail perkembangan siswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data perkembangan siswa",
    });
  }
});

// 3. Create student development
app.post("/api/students/:studentId/developments", async (req, res) => {
  const { studentId } = req.params;

  try {
    const development = await prisma.studentDevelopment.create({
      data: {
        studentId: Number(studentId),
        academicYear: req.body.academicYear,
        semester: req.body.semester,
        height: req.body.height ? Number(req.body.height) : null,
        weight: req.body.weight ? Number(req.body.weight) : null,
        academic: req.body.academic || null,
        attitude: req.body.attitude || null,
        social: req.body.social || null,
        notes: req.body.notes || null,
      },
    });

    res.status(201).json(development);
  } catch (error) {
    console.error("Error menambah data perkembangan siswa:", error);
    res.status(500).json({
      message: "Gagal menambahkan data perkembangan siswa",
    });
  }
});

// 4. Update student development
app.put("/api/developments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const development = await prisma.studentDevelopment.update({
      where: {
        id: Number(id),
      },
      data: {
        academicYear: req.body.academicYear,
        semester: req.body.semester,
        height: req.body.height ? Number(req.body.height) : null,
        weight: req.body.weight ? Number(req.body.weight) : null,
        academic: req.body.academic || null,
        attitude: req.body.attitude || null,
        social: req.body.social || null,
        notes: req.body.notes || null,
      },
    });

    res.json(development);
  } catch (error) {
    console.error("Error mengupdate data perkembangan siswa:", error);
    res.status(500).json({
      message: "Gagal mengupdate data perkembangan siswa",
    });
  }
});

// 5. Delete student development
app.delete("/api/developments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.studentDevelopment.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Data perkembangan siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error menghapus data perkembangan siswa:", error);
    res.status(500).json({
      message: "Gagal menghapus data perkembangan siswa",
    });
  }
});

// ==========================================
// STUDENT GRADES / NILAI RAPOR
// ==========================================

// 1. Get all grades for a student
app.get("/api/students/:studentId/grades", async (req, res) => {
  const { studentId } = req.params;

  try {
    const grades = await prisma.grade.findMany({
      where: {
        studentId: Number(studentId),
      },
      orderBy: [
        { academicYear: "desc" },
        { semester: "asc" },
        { subject: "asc" },
      ],
    });

    res.json(grades);
  } catch (error) {
    console.error("Error mengambil data nilai siswa:", error);

    res.status(500).json({
      message: "Gagal mengambil data nilai siswa",
    });
  }
});


// 2. Get grade by ID
app.get("/api/grades/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await prisma.grade.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!grade) {
      return res.status(404).json({
        message: "Data nilai siswa tidak ditemukan",
      });
    }

    res.json(grade);
  } catch (error) {
    console.error("Error mengambil detail nilai siswa:", error);

    res.status(500).json({
      message: "Gagal mengambil data nilai siswa",
    });
  }
});


// 3. Create grade
app.post("/api/students/:studentId/grades", async (req, res) => {
  const { studentId } = req.params;

  try {
    const grade = await prisma.grade.create({
      data: {
        studentId: Number(studentId),

        academicYear: req.body.academicYear,

        semester: req.body.semester,

        subject: req.body.subject,

        knowledge:
          req.body.knowledge !== "" &&
          req.body.knowledge !== null &&
          req.body.knowledge !== undefined
            ? Number(req.body.knowledge)
            : null,

        skill:
          req.body.skill !== "" &&
          req.body.skill !== null &&
          req.body.skill !== undefined
            ? Number(req.body.skill)
            : null,

        finalScore:
          req.body.finalScore !== "" &&
          req.body.finalScore !== null &&
          req.body.finalScore !== undefined
            ? Number(req.body.finalScore)
            : null,

        predicate:
          req.body.predicate || null,

        description:
          req.body.description || null,
      },
    });

    res.status(201).json(grade);
  } catch (error) {
    console.error("Error menambah data nilai siswa:", error);

    res.status(500).json({
      message: "Gagal menambahkan data nilai siswa",
    });
  }
});


// 4. Update grade
app.put("/api/grades/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await prisma.grade.update({
      where: {
        id: Number(id),
      },

      data: {
        academicYear: req.body.academicYear,

        semester: req.body.semester,

        subject: req.body.subject,

        knowledge:
          req.body.knowledge !== "" &&
          req.body.knowledge !== null &&
          req.body.knowledge !== undefined
            ? Number(req.body.knowledge)
            : null,

        skill:
          req.body.skill !== "" &&
          req.body.skill !== null &&
          req.body.skill !== undefined
            ? Number(req.body.skill)
            : null,

        finalScore:
          req.body.finalScore !== "" &&
          req.body.finalScore !== null &&
          req.body.finalScore !== undefined
            ? Number(req.body.finalScore)
            : null,

        predicate:
          req.body.predicate || null,

        description:
          req.body.description || null,
      },
    });

    res.json(grade);
  } catch (error) {
    console.error("Error mengupdate data nilai siswa:", error);

    res.status(500).json({
      message: "Gagal mengupdate data nilai siswa",
    });
  }
});


// 5. Delete grade
app.delete("/api/grades/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.grade.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Data nilai siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error menghapus data nilai siswa:", error);

    res.status(500).json({
      message: "Gagal menghapus data nilai siswa",
    });
  }
});

// ==========================================
// ACHIEVEMENT
// ==========================================

// 1. GET semua prestasi berdasarkan student
app.get("/api/students/:studentId/achievements", async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const achievements = await prisma.achievement.findMany({
      where: {
        studentId,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(achievements);
  } catch (error) {
    console.error("Error mengambil data prestasi:", error);
    res.status(500).json({
      message: "Gagal mengambil data prestasi",
    });
  }
});

// 2. GET satu prestasi berdasarkan ID
app.get("/api/achievements/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const achievement = await prisma.achievement.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
      },
    });

    if (!achievement) {
      return res.status(404).json({
        message: "Data prestasi tidak ditemukan",
      });
    }

    res.json(achievement);
  } catch (error) {
    console.error("Error mengambil detail prestasi:", error);
    res.status(500).json({
      message: "Gagal mengambil detail prestasi",
    });
  }
});

// 3. POST tambah prestasi
app.post("/api/students/:studentId/achievements", async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const {
      achievementType,
      title,
      level,
      rank,
      organizer,
      academicYear,
      date,
      description,
    } = req.body;

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan",
      });
    }

    if (!achievementType || !title) {
      return res.status(400).json({
        message: "Jenis prestasi dan nama prestasi wajib diisi",
      });
    }

    const achievement = await prisma.achievement.create({
      data: {
        studentId,
        achievementType,
        title,
        level: level || null,
        rank: rank || null,
        organizer: organizer || null,
        academicYear: academicYear || null,
        date: date ? new Date(date) : null,
        description: description || null,
      },
    });

    res.status(201).json(achievement);
  } catch (error) {
    console.error("Error menambahkan prestasi:", error);
    res.status(500).json({
      message: "Gagal menambahkan data prestasi",
    });
  }
});

// 4. PUT edit prestasi
app.put("/api/achievements/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      achievementType,
      title,
      level,
      rank,
      organizer,
      academicYear,
      date,
      description,
    } = req.body;

    const existingAchievement = await prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!existingAchievement) {
      return res.status(404).json({
        message: "Data prestasi tidak ditemukan",
      });
    }

    if (!achievementType || !title) {
      return res.status(400).json({
        message: "Jenis prestasi dan nama prestasi wajib diisi",
      });
    }

    const achievement = await prisma.achievement.update({
      where: {
        id,
      },
      data: {
        achievementType,
        title,
        level: level || null,
        rank: rank || null,
        organizer: organizer || null,
        academicYear: academicYear || null,
        date: date ? new Date(date) : null,
        description: description || null,
      },
    });

    res.json(achievement);
  } catch (error) {
    console.error("Error memperbarui prestasi:", error);
    res.status(500).json({
      message: "Gagal memperbarui data prestasi",
    });
  }
});

// 5. DELETE prestasi
app.delete("/api/achievements/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingAchievement = await prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!existingAchievement) {
      return res.status(404).json({
        message: "Data prestasi tidak ditemukan",
      });
    }

    await prisma.achievement.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Data prestasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error menghapus prestasi:", error);
    res.status(500).json({
      message: "Gagal menghapus data prestasi",
    });
  }
});

// ==========================================
// EXTRACURRICULAR / EKSTRAKURIKULER
// ==========================================

// GET semua ekstrakurikuler berdasarkan student
app.get('/api/students/:studentId/extracurriculars', async (req, res) => {
  try {
    const studentId = Number(req.params.studentId)

    const extracurriculars = await prisma.extracurricular.findMany({
      where: {
        studentId: studentId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(extracurriculars)
  } catch (error) {
    console.error('Error mengambil data ekstrakurikuler:', error)

    res.status(500).json({
      message: 'Gagal mengambil data ekstrakurikuler.'
    })
  }
})


// GET satu ekstrakurikuler berdasarkan ID
app.get('/api/extracurriculars/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const extracurricular = await prisma.extracurricular.findUnique({
      where: {
        id: id
      }
    })

    if (!extracurricular) {
      return res.status(404).json({
        message: 'Data ekstrakurikuler tidak ditemukan.'
      })
    }

    res.json(extracurricular)
  } catch (error) {
    console.error('Error mengambil data ekstrakurikuler:', error)

    res.status(500).json({
      message: 'Gagal mengambil data ekstrakurikuler.'
    })
  }
})


// POST tambah ekstrakurikuler
app.post('/api/students/:studentId/extracurriculars', async (req, res) => {
  try {
    const studentId = Number(req.params.studentId)

    const {
      activityName,
      role,
      level,
      academicYear,
      status,
      description
    } = req.body

    if (!activityName || !activityName.trim()) {
      return res.status(400).json({
        message: 'Nama kegiatan ekstrakurikuler wajib diisi.'
      })
    }

    // Pastikan siswa tersedia
    const student = await prisma.student.findUnique({
      where: {
        id: studentId
      }
    })

    if (!student) {
      return res.status(404).json({
        message: 'Data siswa tidak ditemukan.'
      })
    }

    const extracurricular = await prisma.extracurricular.create({
      data: {
        studentId,
        activityName: activityName.trim(),
        role: role?.trim() || null,
        level: level?.trim() || null,
        academicYear: academicYear?.trim() || null,
        status: status?.trim() || 'ACTIVE',
        description: description?.trim() || null
      }
    })

    res.status(201).json(extracurricular)
  } catch (error) {
    console.error('Error menambahkan data ekstrakurikuler:', error)

    res.status(500).json({
      message: 'Gagal menambahkan data ekstrakurikuler.'
    })
  }
})


// PUT edit ekstrakurikuler
app.put('/api/extracurriculars/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const {
      activityName,
      role,
      level,
      academicYear,
      status,
      description
    } = req.body

    if (!activityName || !activityName.trim()) {
      return res.status(400).json({
        message: 'Nama kegiatan ekstrakurikuler wajib diisi.'
      })
    }

    // Pastikan data tersedia
    const existingExtracurricular =
      await prisma.extracurricular.findUnique({
        where: {
          id: id
        }
      })

    if (!existingExtracurricular) {
      return res.status(404).json({
        message: 'Data ekstrakurikuler tidak ditemukan.'
      })
    }

    const extracurricular = await prisma.extracurricular.update({
      where: {
        id: id
      },
      data: {
        activityName: activityName.trim(),
        role: role?.trim() || null,
        level: level?.trim() || null,
        academicYear: academicYear?.trim() || null,
        status: status?.trim() || 'ACTIVE',
        description: description?.trim() || null
      }
    })

    res.json(extracurricular)
  } catch (error) {
    console.error('Error mengubah data ekstrakurikuler:', error)

    res.status(500).json({
      message: 'Gagal mengubah data ekstrakurikuler.'
    })
  }
})


// DELETE ekstrakurikuler
app.delete('/api/extracurriculars/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    // Pastikan data tersedia
    const existingExtracurricular =
      await prisma.extracurricular.findUnique({
        where: {
          id: id
        }
      })

    if (!existingExtracurricular) {
      return res.status(404).json({
        message: 'Data ekstrakurikuler tidak ditemukan.'
      })
    }

    await prisma.extracurricular.delete({
      where: {
        id: id
      }
    })

    res.json({
      message: 'Data ekstrakurikuler berhasil dihapus.'
    })
  } catch (error) {
    console.error('Error menghapus data ekstrakurikuler:', error)

    res.status(500).json({
      message: 'Gagal menghapus data ekstrakurikuler.'
    })
  }
})

// ==========================================
// PELANGGARAN
// ==========================================

// GET semua pelanggaran berdasarkan student
app.get('/api/students/:studentId/violations', async (req, res) => {
  try {
    const studentId = Number(req.params.studentId)

    const violations = await prisma.violation.findMany({
      where: {
        studentId: studentId
      },
      orderBy: {
        violationDate: 'desc'
      }
    })

    res.json(violations)
  } catch (error) {
    console.error('Error mengambil data pelanggaran:', error)

    res.status(500).json({
      message: 'Gagal mengambil data pelanggaran.'
    })
  }
})

// GET satu pelanggaran berdasarkan ID
app.get('/api/violations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const violation = await prisma.violation.findUnique({
      where: {
        id: id
      }
    })

    if (!violation) {
      return res.status(404).json({
        message: 'Data pelanggaran tidak ditemukan.'
      })
    }

    res.json(violation)
  } catch (error) {
    console.error('Error mengambil data pelanggaran:', error)

    res.status(500).json({
      message: 'Gagal mengambil data pelanggaran.'
    })
  }
})

// POST tambah pelanggaran
app.post('/api/students/:studentId/violations', async (req, res) => {
  try {
    const studentId = Number(req.params.studentId)

    const {
      violationType,
      level,
      points,
      violationDate,
      sanction,
      status,
      description
    } = req.body

    // Validasi nama/jenis pelanggaran
    if (!violationType || !violationType.trim()) {
      return res.status(400).json({
        message: 'Jenis pelanggaran wajib diisi.'
      })
    }

    // Validasi tanggal
    if (!violationDate) {
      return res.status(400).json({
        message: 'Tanggal pelanggaran wajib diisi.'
      })
    }

    // Cek siswa
    const student = await prisma.student.findUnique({
      where: {
        id: studentId
      }
    })

    if (!student) {
      return res.status(404).json({
        message: 'Data siswa tidak ditemukan.'
      })
    }

    const violation = await prisma.violation.create({
      data: {
        studentId,
        violationType: violationType.trim(),
        level: level?.trim() || null,
        points:
          points !== undefined &&
          points !== null &&
          points !== ''
            ? Number(points)
            : null,
        violationDate: new Date(violationDate),
        sanction: sanction?.trim() || null,
        status: status?.trim() || 'ACTIVE',
        description: description?.trim() || null
      }
    })

    res.status(201).json(violation)
  } catch (error) {
    console.error('Error menambahkan data pelanggaran:', error)

    res.status(500).json({
      message: 'Gagal menambahkan data pelanggaran.'
    })
  }
})

// PUT edit pelanggaran
app.put('/api/violations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const {
      violationType,
      level,
      points,
      violationDate,
      sanction,
      status,
      description
    } = req.body

    // Validasi jenis pelanggaran
    if (!violationType || !violationType.trim()) {
      return res.status(400).json({
        message: 'Jenis pelanggaran wajib diisi.'
      })
    }

    // Validasi tanggal
    if (!violationDate) {
      return res.status(400).json({
        message: 'Tanggal pelanggaran wajib diisi.'
      })
    }

    // Cek data pelanggaran
    const existingViolation = await prisma.violation.findUnique({
      where: {
        id: id
      }
    })

    if (!existingViolation) {
      return res.status(404).json({
        message: 'Data pelanggaran tidak ditemukan.'
      })
    }

    const violation = await prisma.violation.update({
      where: {
        id: id
      },
      data: {
        violationType: violationType.trim(),
        level: level?.trim() || null,
        points:
          points !== undefined &&
          points !== null &&
          points !== ''
            ? Number(points)
            : null,
        violationDate: new Date(violationDate),
        sanction: sanction?.trim() || null,
        status: status?.trim() || 'ACTIVE',
        description: description?.trim() || null
      }
    })

    res.json(violation)
  } catch (error) {
    console.error('Error mengubah data pelanggaran:', error)

    res.status(500).json({
      message: 'Gagal mengubah data pelanggaran.'
    })
  }
})

// DELETE pelanggaran
app.delete('/api/violations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    // Cek data pelanggaran
    const existingViolation = await prisma.violation.findUnique({
      where: {
        id: id
      }
    })

    if (!existingViolation) {
      return res.status(404).json({
        message: 'Data pelanggaran tidak ditemukan.'
      })
    }

    await prisma.violation.delete({
      where: {
        id: id
      }
    })

    res.json({
      message: 'Data pelanggaran berhasil dihapus.'
    })
  } catch (error) {
    console.error('Error menghapus data pelanggaran:', error)

    res.status(500).json({
      message: 'Gagal menghapus data pelanggaran.'
    })
  }
})

// ==========================================
// DASHBOARD
// ==========================================

// GET /api/dashboard
// Mengambil ringkasan seluruh data Buku Induk

app.get("/api/dashboard", async (req, res) => {
  try {
    // ==========================================
    // STUDENT
    // ==========================================

    const totalStudents = await prisma.student.count();

    const activeStudents = await prisma.student.count({
      where: {
        status: "ACTIVE",
      },
    });

    const inactiveStudents = await prisma.student.count({
      where: {
        status: {
          not: "ACTIVE",
        },
      },
    });


    // ==========================================
    // PARENTS / WALI
    // ==========================================

    const totalParents = await prisma.parent.count();


    // ==========================================
    // EDUCATION
    // ==========================================

    const totalEducation = await prisma.education.count();


    // ==========================================
    // DEVELOPMENT
    // ==========================================

    const totalDevelopments =
      await prisma.studentDevelopment.count();


    // ==========================================
    // GRADES / NILAI
    // ==========================================

    const totalGrades = await prisma.grade.count();

    const gradeAverage = await prisma.grade.aggregate({
      _avg: {
        finalScore: true,
      },
    });


    // ==========================================
    // ACHIEVEMENT / PRESTASI
    // ==========================================

    const totalAchievements =
      await prisma.achievement.count();


    // ==========================================
    // EXTRACURRICULAR
    // ==========================================

    const totalExtracurriculars =
      await prisma.extracurricular.count();


    // ==========================================
    // VIOLATION / PELANGGARAN
    // ==========================================

    const totalViolations =
      await prisma.violation.count();

    const violationPoints =
      await prisma.violation.aggregate({
        _sum: {
          points: true,
        },
      });


    // ==========================================
    // GENDER
    // ==========================================

    const maleStudents = await prisma.student.count({
      where: {
        gender: "Laki-laki",
      },
    });

    const femaleStudents = await prisma.student.count({
      where: {
        gender: "Perempuan",
      },
    });


    // ==========================================
    // RECENT STUDENTS
    // ==========================================

    const recentStudents =
      await prisma.student.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          nis: true,
          nisn: true,
          fullName: true,
          gender: true,
          status: true,
          createdAt: true,
        },
      });


    // ==========================================
    // RECENT ACHIEVEMENTS
    // ==========================================

    const recentAchievements =
      await prisma.achievement.findMany({
        orderBy: {
          date: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          achievementType: true,
          level: true,
          rank: true,
          date: true,
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      });


    // ==========================================
    // RECENT VIOLATIONS
    // ==========================================

    const recentViolations =
      await prisma.violation.findMany({
        orderBy: {
          violationDate: "desc",
        },
        take: 5,
        select: {
          id: true,
          violationType: true,
          level: true,
          points: true,
          violationDate: true,
          sanction: true,
          status: true,
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({
      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,

        gender: {
          male: maleStudents,
          female: femaleStudents,
        },
      },

      parents: {
        total: totalParents,
      },

      education: {
        total: totalEducation,
      },

      developments: {
        total: totalDevelopments,
      },

      grades: {
        total: totalGrades,
        average:
          gradeAverage._avg.finalScore !== null
            ? Number(
                gradeAverage._avg.finalScore.toFixed(2)
              )
            : 0,
      },

      achievements: {
        total: totalAchievements,
      },

      extracurriculars: {
        total: totalExtracurriculars,
      },

      violations: {
        total: totalViolations,
        points:
          violationPoints._sum.points ?? 0,
      },

      recentStudents,

      recentAchievements,

      recentViolations,
    });
  } catch (error) {
    console.error(
      "Error mengambil data dashboard:",
      error
    );

    res.status(500).json({
      message: "Gagal mengambil data dashboard",
    });
  }
});

export default app;