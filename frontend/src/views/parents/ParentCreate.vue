<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const error = ref(null)

const form = ref({
  relation: 'Ayah',
  name: '',
  nik: '',
  birthPlace: '',
  birthDate: '',
  education: '',
  occupation: '',
  income: '',
  phone: '',
  address: '',
})


// ==========================================
// SIMPAN DATA ORANG TUA / WALI
// ==========================================

const submitForm = async () => {
  loading.value = true
  error.value = null

  try {
    const studentId = route.params.id

    await api.post(`/students/${studentId}/parents`, {
      relation: form.value.relation,
      name: form.value.name,
      nik: form.value.nik || null,
      birthPlace: form.value.birthPlace || null,
      birthDate: form.value.birthDate || null,
      education: form.value.education || null,
      occupation: form.value.occupation || null,
      income: form.value.income || null,
      phone: form.value.phone || null,
      address: form.value.address || null,
    })

    alert('Data orang tua/wali berhasil ditambahkan!')

    // Kembali ke halaman detail siswa
    router.push(`/students/${studentId}`)

  } catch (err) {
    console.error(err)

    error.value =
      err.response?.data?.message ||
      'Gagal menyimpan data orang tua/wali.'
  } finally {
    loading.value = false
  }
}


// ==========================================
// BATAL
// ==========================================

const cancel = () => {
  const studentId = route.params.id

  router.push(`/students/${studentId}`)
}
</script>


<template>

  <main class="parent-create">

    <h1>Tambah Orang Tua / Wali</h1>

    <p class="description">
      Masukkan informasi orang tua atau wali siswa.
    </p>


    <!-- ERROR -->

    <div
      v-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <!-- FORM -->

    <form
      @submit.prevent="submitForm"
      class="form-container"
    >


      <!-- ================================= -->
      <!-- HUBUNGAN -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Hubungan dengan Siswa:
        </label>

        <select
          v-model="form.relation"
          required
        >

          <option value="Ayah">
            Ayah
          </option>

          <option value="Ibu">
            Ibu
          </option>

          <option value="Wali">
            Wali
          </option>

        </select>

      </div>


      <!-- ================================= -->
      <!-- NAMA -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Nama Lengkap:
        </label>

        <input
          type="text"
          v-model="form.name"
          required
          placeholder="Masukkan nama lengkap"
        />

      </div>


      <!-- ================================= -->
      <!-- NIK -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          NIK:
        </label>

        <input
          type="text"
          v-model="form.nik"
          placeholder="Masukkan NIK"
        />

      </div>


      <!-- ================================= -->
      <!-- TEMPAT LAHIR -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Tempat Lahir:
        </label>

        <input
          type="text"
          v-model="form.birthPlace"
          placeholder="Masukkan tempat lahir"
        />

      </div>


      <!-- ================================= -->
      <!-- TANGGAL LAHIR -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Tanggal Lahir:
        </label>

        <input
          type="date"
          v-model="form.birthDate"
        />

      </div>


      <!-- ================================= -->
      <!-- PENDIDIKAN -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Pendidikan Terakhir:
        </label>

        <select v-model="form.education">

          <option value="">
            -- Pilih Pendidikan --
          </option>

          <option value="Tidak Sekolah">
            Tidak Sekolah
          </option>

          <option value="SD">
            SD
          </option>

          <option value="SMP">
            SMP
          </option>

          <option value="SMA/SMK">
            SMA/SMK
          </option>

          <option value="D1">
            D1
          </option>

          <option value="D2">
            D2
          </option>

          <option value="D3">
            D3
          </option>

          <option value="D4/S1">
            D4/S1
          </option>

          <option value="S2">
            S2
          </option>

          <option value="S3">
            S3
          </option>

        </select>

      </div>


      <!-- ================================= -->
      <!-- PEKERJAAN -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Pekerjaan:
        </label>

        <input
          type="text"
          v-model="form.occupation"
          placeholder="Masukkan pekerjaan"
        />

      </div>


      <!-- ================================= -->
      <!-- PENGHASILAN -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Penghasilan:
        </label>

        <input
          type="text"
          v-model="form.income"
          placeholder="Contoh: Rp5.000.000"
        />

      </div>


      <!-- ================================= -->
      <!-- TELEPON -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Nomor Telepon:
        </label>

        <input
          type="tel"
          v-model="form.phone"
          placeholder="Masukkan nomor telepon"
        />

      </div>


      <!-- ================================= -->
      <!-- ALAMAT -->
      <!-- ================================= -->

      <div class="form-group">

        <label>
          Alamat:
        </label>

        <textarea
          v-model="form.address"
          rows="4"
          placeholder="Masukkan alamat lengkap"
        ></textarea>

      </div>


      <!-- ================================= -->
      <!-- BUTTON -->
      <!-- ================================= -->

      <div class="button-group">

        <button
          type="button"
          class="btn-cancel"
          @click="cancel"
        >
          Batal
        </button>

        <button
          type="submit"
          class="btn-save"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
        </button>

      </div>

    </form>

  </main>

</template>


<style scoped>

.parent-create {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.description {
  color: #666;
  margin-bottom: 20px;
}

.error-box {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
}

.form-container {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
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

.button-group {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.button-group button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-save {
  background-color: #4caf50;
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

.button-group button:hover {
  opacity: 0.9;
}

</style>