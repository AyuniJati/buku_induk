<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const form = ref({
  relation: '',
  name: '',
  nik: '',
  birthPlace: '',
  birthDate: '',
  education: '',
  occupation: '',
  income: '',
  phone: '',
  address: ''
})

const loading = ref(false)
const fetching = ref(true)
const error = ref(null)

const fetchParent = async () => {
  try {
    const parentId = route.params.parentId

    const response = await api.get(`/parents/${parentId}`)

    const parent = response.data

    form.value = {
      relation: parent.relation || '',
      name: parent.name || '',
      nik: parent.nik || '',
      birthPlace: parent.birthPlace || '',
      birthDate: parent.birthDate
        ? parent.birthDate.substring(0, 10)
        : '',
      education: parent.education || '',
      occupation: parent.occupation || '',
      income: parent.income || '',
      phone: parent.phone || '',
      address: parent.address || ''
    }

  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data orang tua/wali.'
  } finally {
    fetching.value = false
  }
}

const submitForm = async () => {
  loading.value = true
  error.value = null

  try {
    const parentId = route.params.parentId
    const studentId = route.params.studentId

    await api.put(`/parents/${parentId}`, form.value)

    alert('Data orang tua/wali berhasil diperbarui!')

    router.push(`/students/${studentId}`)

  } catch (err) {
    console.error(err)
    error.value = 'Gagal memperbarui data orang tua/wali.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchParent()
})
</script>

<template>
  <main class="parent-edit">

    <h1>Edit Data Orang Tua / Wali</h1>

    <div v-if="fetching" class="loading">
      Memuat data...
    </div>

    <div v-else-if="error" class="error-box">
      {{ error }}
    </div>

    <form
      v-else
      @submit.prevent="submitForm"
      class="form-container"
    >

      <!-- HUBUNGAN -->
      <div class="form-group">
        <label>Hubungan</label>

        <select v-model="form.relation" required>
          <option value="">-- Pilih Hubungan --</option>
          <option value="Ayah">Ayah</option>
          <option value="Ibu">Ibu</option>
          <option value="Wali">Wali</option>
        </select>
      </div>

      <!-- NAMA -->
      <div class="form-group">
        <label>Nama Lengkap</label>

        <input
          type="text"
          v-model="form.name"
          required
          placeholder="Nama lengkap"
        />
      </div>

      <!-- NIK -->
      <div class="form-group">
        <label>NIK</label>

        <input
          type="text"
          v-model="form.nik"
          placeholder="NIK"
        />
      </div>

      <!-- TEMPAT LAHIR -->
      <div class="form-group">
        <label>Tempat Lahir</label>

        <input
          type="text"
          v-model="form.birthPlace"
          placeholder="Tempat lahir"
        />
      </div>

      <!-- TANGGAL LAHIR -->
      <div class="form-group">
        <label>Tanggal Lahir</label>

        <input
          type="date"
          v-model="form.birthDate"
        />
      </div>

      <!-- PENDIDIKAN -->
      <div class="form-group">
        <label>Pendidikan Terakhir</label>

        <input
          type="text"
          v-model="form.education"
          placeholder="Contoh: SMA"
        />
      </div>

      <!-- PEKERJAAN -->
      <div class="form-group">
        <label>Pekerjaan</label>

        <input
          type="text"
          v-model="form.occupation"
          placeholder="Pekerjaan"
        />
      </div>

      <!-- PENGHASILAN -->
      <div class="form-group">
        <label>Penghasilan</label>

        <input
          type="text"
          v-model="form.income"
          placeholder="Contoh: Rp5.000.000"
        />
      </div>

      <!-- TELEPON -->
      <div class="form-group">
        <label>Nomor Telepon</label>

        <input
          type="text"
          v-model="form.phone"
          placeholder="Nomor telepon"
        />
      </div>

      <!-- ALAMAT -->
      <div class="form-group">
        <label>Alamat</label>

        <textarea
          v-model="form.address"
          placeholder="Alamat lengkap"
        ></textarea>
      </div>

      <div class="button-group">

        <button
          type="button"
          class="btn-cancel"
          @click="router.push(`/students/${route.params.studentId}`)"
        >
          Batal
        </button>

        <button
          type="submit"
          class="btn-save"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : 'Update Data' }}
        </button>

      </div>

    </form>

  </main>
</template>

<style scoped>
.parent-edit {
  padding: 2rem;
  max-width: 700px;
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
  border-radius: 6px;
  margin-bottom: 15px;
}

.form-container {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
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
  padding: 9px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 100px;
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
  background-color: #2196f3;
  color: white;
}

.btn-cancel {
  background-color: #757575;
  color: white;
}

.btn-save:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
</style>