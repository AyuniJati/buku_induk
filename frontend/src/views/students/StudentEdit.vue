<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const form = ref({
  nis: '',
  nisn: '',
  nik: '',
  fullName: '',
  nickname: '',
  gender: 'Laki-laki',
  birthPlace: '',
  birthDate: '',
  religion: '',
  address: '',
  phone: '',
  email: '',
  status: 'ACTIVE',
})

const loading = ref(false)
const fetching = ref(true)
const error = ref(null)


// ==========================================
// MENGAMBIL DATA SISWA
// ==========================================

onMounted(async () => {
  try {
    const studentId = route.params.id

    const response = await api.get(`/students/${studentId}`)

    const student = response.data

    form.value.nis = student.nis || ''
    form.value.nisn = student.nisn || ''
    form.value.nik = student.nik || ''
    form.value.fullName = student.fullName || ''
    form.value.nickname = student.nickname || ''
    form.value.gender = student.gender || 'Laki-laki'
    form.value.birthPlace = student.birthPlace || ''

    // Mengubah tanggal dari ISO menjadi format YYYY-MM-DD
    form.value.birthDate = student.birthDate
      ? student.birthDate.substring(0, 10)
      : ''

    form.value.religion = student.religion || ''
    form.value.address = student.address || ''
    form.value.phone = student.phone || ''
    form.value.email = student.email || ''
    form.value.status = student.status || 'ACTIVE'

  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data siswa. Pastikan data tersebut masih ada.'
  } finally {
    fetching.value = false
  }
})


// ==========================================
// UPDATE DATA SISWA
// ==========================================

const submitForm = async () => {
  loading.value = true
  error.value = null

  try {
    const studentId = route.params.id

    await api.put(`/students/${studentId}`, {
      nis: form.value.nis,
      nisn: form.value.nisn,
      nik: form.value.nik || null,
      fullName: form.value.fullName,
      nickname: form.value.nickname || null,
      gender: form.value.gender,
      birthPlace: form.value.birthPlace || null,
      birthDate: form.value.birthDate
        ? new Date(form.value.birthDate)
        : null,
      religion: form.value.religion || null,
      address: form.value.address || null,
      phone: form.value.phone || null,
      email: form.value.email || null,
      status: form.value.status,
    })

    alert('Data siswa berhasil diperbarui!')

    router.push(`/students/${studentId}`)

  } catch (err) {
    console.error(err)

    error.value =
      err.response?.data?.message ||
      'Gagal menyimpan perubahan data.'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <main class="student-edit">

    <h1>Edit Data Siswa</h1>

    <!-- Loading -->
    <div v-if="fetching" class="loading">
      Memuat data siswa...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-box">
      {{ error }}
    </div>

    <!-- Form -->
    <form
      v-else
      @submit.prevent="submitForm"
      class="form-container"
    >

      <!-- ================================= -->
      <!-- IDENTITAS SISWA -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>Identitas Siswa</h2>

        <div class="form-grid">

          <!-- NIS -->
          <div class="form-group">
            <label>NIS</label>

            <input
              type="text"
              v-model="form.nis"
              required
              placeholder="Masukkan NIS"
            />
          </div>


          <!-- NISN -->
          <div class="form-group">
            <label>NISN</label>

            <input
              type="text"
              v-model="form.nisn"
              required
              placeholder="Masukkan NISN"
            />
          </div>


          <!-- NIK -->
          <div class="form-group">
            <label>NIK</label>

            <input
              type="text"
              v-model="form.nik"
              placeholder="Masukkan NIK"
            />
          </div>


          <!-- Nama Lengkap -->
          <div class="form-group">
            <label>Nama Lengkap</label>

            <input
              type="text"
              v-model="form.fullName"
              required
              placeholder="Nama lengkap siswa"
            />
          </div>


          <!-- Nama Panggilan -->
          <div class="form-group">
            <label>Nama Panggilan</label>

            <input
              type="text"
              v-model="form.nickname"
              placeholder="Nama panggilan"
            />
          </div>


          <!-- Jenis Kelamin -->
          <div class="form-group">
            <label>Jenis Kelamin</label>

            <select v-model="form.gender">
              <option value="Laki-laki">
                Laki-laki
              </option>

              <option value="Perempuan">
                Perempuan
              </option>
            </select>
          </div>


          <!-- Tempat Lahir -->
          <div class="form-group">
            <label>Tempat Lahir</label>

            <input
              type="text"
              v-model="form.birthPlace"
              placeholder="Tempat lahir"
            />
          </div>


          <!-- Tanggal Lahir -->
          <div class="form-group">
            <label>Tanggal Lahir</label>

            <input
              type="date"
              v-model="form.birthDate"
            />
          </div>


          <!-- Agama -->
          <div class="form-group">
            <label>Agama</label>

            <select v-model="form.religion">

              <option value="">
                Pilih agama
              </option>

              <option value="Islam">
                Islam
              </option>

              <option value="Kristen">
                Kristen
              </option>

              <option value="Katolik">
                Katolik
              </option>

              <option value="Hindu">
                Hindu
              </option>

              <option value="Buddha">
                Buddha
              </option>

              <option value="Konghucu">
                Konghucu
              </option>

            </select>
          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- KONTAK -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>Kontak</h2>

        <div class="form-grid">

          <!-- Telepon -->
          <div class="form-group">

            <label>Nomor Telepon</label>

            <input
              type="tel"
              v-model="form.phone"
              placeholder="Contoh: 08123456789"
            />

          </div>


          <!-- Email -->
          <div class="form-group">

            <label>Email</label>

            <input
              type="email"
              v-model="form.email"
              placeholder="Alamat email"
            />

          </div>


          <!-- Alamat -->
          <div class="form-group full-width">

            <label>Alamat</label>

            <textarea
              v-model="form.address"
              rows="4"
              placeholder="Alamat lengkap siswa"
            ></textarea>

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- STATUS -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>Status Siswa</h2>

        <div class="form-group">

          <label>Status</label>

          <select v-model="form.status">

            <option value="ACTIVE">
              Aktif
            </option>

            <option value="INACTIVE">
              Tidak Aktif
            </option>

            <option value="GRADUATED">
              Lulus
            </option>

            <option value="TRANSFERRED">
              Pindah
            </option>

          </select>

        </div>

      </section>


      <!-- ================================= -->
      <!-- BUTTON -->
      <!-- ================================= -->

      <div class="button-group">

        <button
          type="button"
          class="btn-cancel"
          @click="router.push(`/students/${route.params.id}`)"
        >
          Batal
        </button>

        <button
          type="submit"
          class="btn-save"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>

      </div>

    </form>

  </main>
</template>


<style scoped>

.student-edit {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.loading {
  padding: 20px;
  text-align: center;
}

.error-box {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}

.form-container {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.full-width {
  grid-column: span 2;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-save {
  background-color: #2196f3;
  color: white;
}

.btn-save:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #757575;
  color: white;
}

@media (max-width: 600px) {

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

}

</style>