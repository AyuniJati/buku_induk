<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute() // Digunakan untuk mengambil ID dari URL

const form = ref({
  nis: '',
  nisn: '', 
  fullName: '',
  gender: 'Laki-laki',
})

const loading = ref(false)
const fetching = ref(true)
const error = ref(null)

// 1. Ambil data siswa saat halaman dimuat
onMounted(async () => {
  try {
    const studentId = route.params.id
    const response = await axios.get(`http://localhost:3000/api/students/${studentId}`)
    
    // Masukkan data dari backend ke dalam form
    form.value.nis = response.data.nis
    form.value.nisn = response.data.nisn || ''
    form.value.fullName = response.data.fullName
    form.value.gender = response.data.gender
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data siswa. Pastikan data tersebut masih ada.'
  } finally {
    fetching.value = false
  }
})

// 2. Fungsi untuk mengirim perubahan data ke Backend (metode PUT)
const submitForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    const studentId = route.params.id
    await axios.put(`http://localhost:3000/api/students/${studentId}`, form.value)
    alert('Data siswa berhasil diperbarui!')
    // Kembali ke halaman daftar siswa
    router.push('/students')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menyimpan perubahan data.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="student-edit">
    <h1>Edit Data Siswa</h1>
    
    <div v-if="fetching">Memuat data...</div>
    <div v-else-if="error" class="error-box">{{ error }}</div>

    <form v-else @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label>NIS (Nomor Induk Siswa):</label>
        <input type="text" v-model="form.nis" required placeholder="Masukkan NIS" />
      </div>

      <div class="form-group">
        <label>NISN:</label>
        <input type="text" v-model="form.nisn" required placeholder="Masukkan NISN unik" />
      </div>

      <div class="form-group">
        <label>Nama Lengkap:</label>
        <input type="text" v-model="form.fullName" required placeholder="Nama lengkap siswa" />
      </div>

      <div class="form-group">
        <label>Jenis Kelamin:</label>
        <select v-model="form.gender">
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>

      <div class="button-group">
        <button type="button" class="btn-cancel" @click="router.push('/students')">Batal</button>
        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Update Data' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
/* Style sama dengan StudentCreate */
.student-edit { padding: 2rem; max-width: 600px; margin: 0 auto; }
.error-box { background-color: #ffebee; color: #c62828; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
.form-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input, .form-group select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.button-group { margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end; }
.btn-save { padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; } /* Warna biru untuk update */
.btn-save:disabled { background-color: #9e9e9e; cursor: not-allowed; }
.btn-cancel { padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>