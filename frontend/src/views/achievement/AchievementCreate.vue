<template>
  <div class="achievement-create">
    <div v-if="loading" class="loading">
      Memuat data siswa...
    </div>

    <div v-else class="form-container">
      <div class="form-header">
        <div>
          <h1>Tambah Prestasi</h1>

          <p v-if="studentName">
            Siswa: <strong>{{ studentName }}</strong>
          </p>
        </div>
      </div>

      <div v-if="error" class="error-box">
        {{ error }}
      </div>

      <form @submit.prevent="saveAchievement">

        <!-- Jenis Prestasi -->
        <div class="form-group">
          <label for="achievementType">
            Jenis Prestasi <span>*</span>
          </label>

          <select
            id="achievementType"
            v-model="form.achievementType"
            required
          >
            <option value="">Pilih Jenis Prestasi</option>
            <option value="Akademik">Akademik</option>
            <option value="Non-Akademik">Non-Akademik</option>
          </select>
        </div>

        <!-- Nama Prestasi -->
        <div class="form-group">
          <label for="title">
            Nama Prestasi <span>*</span>
          </label>

          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Contoh: Juara 1 Olimpiade Matematika"
            required
          />
        </div>

        <!-- Tingkat -->
        <div class="form-group">
          <label for="level">
            Tingkat
          </label>

          <select id="level" v-model="form.level">
            <option value="">Pilih Tingkat</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Kecamatan">Kecamatan</option>
            <option value="Kabupaten/Kota">Kabupaten/Kota</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
        </div>

        <!-- Peringkat -->
        <div class="form-group">
          <label for="rank">
            Peringkat
          </label>

          <input
            id="rank"
            v-model="form.rank"
            type="text"
            placeholder="Contoh: Juara 1"
          />
        </div>

        <!-- Penyelenggara -->
        <div class="form-group">
          <label for="organizer">
            Penyelenggara
          </label>

          <input
            id="organizer"
            v-model="form.organizer"
            type="text"
            placeholder="Contoh: Dinas Pendidikan"
          />
        </div>

        <!-- Tahun Ajaran -->
        <div class="form-group">
          <label for="academicYear">
            Tahun Ajaran
          </label>

          <input
            id="academicYear"
            v-model="form.academicYear"
            type="text"
            placeholder="Contoh: 2025/2026"
          />
        </div>

        <!-- Tanggal -->
        <div class="form-group">
          <label for="date">
            Tanggal
          </label>

          <input
            id="date"
            v-model="form.date"
            type="date"
          />
        </div>

        <!-- Keterangan -->
        <div class="form-group">
          <label for="description">
            Keterangan
          </label>

          <textarea
            id="description"
            v-model="form.description"
            rows="5"
            placeholder="Masukkan keterangan prestasi..."
          ></textarea>
        </div>

        <!-- Tombol -->
        <div class="button-group">
          <button
            type="button"
            class="btn-cancel"
            @click="goBack"
            :disabled="saving"
          >
            Batal
          </button>

          <button
            type="submit"
            class="btn-save"
            :disabled="saving"
          >
            {{ saving ? "Menyimpan..." : "Simpan Prestasi" }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "../../services/api"

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const studentName = ref("")

const form = ref({
  achievementType: "",
  title: "",
  level: "",
  rank: "",
  organizer: "",
  academicYear: "",
  date: "",
  description: ""
})

// Ambil data siswa
const fetchStudent = async () => {
  try {
    loading.value = true
    error.value = null

    const studentId = route.params.studentId

    const response = await api.get(`/students/${studentId}`)

    studentName.value = response.data.fullName || ""
  } catch (err) {
    console.error("Error mengambil data siswa:", err)

    error.value =
      err.response?.data?.message ||
      "Gagal memuat data siswa."
  } finally {
    loading.value = false
  }
}

// Simpan prestasi
const saveAchievement = async () => {
  try {
    saving.value = true
    error.value = null

    const studentId = route.params.studentId

    if (!form.value.achievementType || !form.value.title) {
      alert("Jenis prestasi dan nama prestasi wajib diisi.")
      saving.value = false
      return
    }

    const payload = {
      achievementType: form.value.achievementType,
      title: form.value.title,
      level: form.value.level || null,
      rank: form.value.rank || null,
      organizer: form.value.organizer || null,
      academicYear: form.value.academicYear || null,
      date: form.value.date || null,
      description: form.value.description || null
    }

    await api.post(
      `/students/${studentId}/achievements`,
      payload
    )

    alert("Data prestasi berhasil ditambahkan.")

    router.push(`/students/${studentId}`)
  } catch (err) {
    console.error("Error menambahkan prestasi:", err)

    alert(
      err.response?.data?.message ||
      "Gagal menambahkan data prestasi."
    )
  } finally {
    saving.value = false
  }
}

// Kembali ke detail siswa
const goBack = () => {
  const studentId = route.params.studentId

  router.push(`/students/${studentId}`)
}

onMounted(() => {
  fetchStudent()
})
</script>

<style scoped>
.achievement-create {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.loading {
  padding: 30px;
  text-align: center;
  color: #555;
}

.error-box {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.form-container {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 25px;
}

.form-header h1 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 24px;
}

.form-header p {
  margin: 0;
  color: #666;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.form-group label span {
  color: #d32f2f;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2196f3;
}

.form-group textarea {
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.button-group button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-cancel {
  background-color: #757575;
  color: white;
}

.btn-save {
  background-color: #2196f3;
  color: white;
}

.button-group button:hover:not(:disabled) {
  opacity: 0.9;
}

.button-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .achievement-create {
    padding: 1rem;
  }

  .form-container {
    padding: 20px;
  }

  .form-header h1 {
    font-size: 21px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
  }
}
</style>