<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'

const router = useRouter()

// State untuk menyimpan inputan form
const form = ref({
  nis: '',
  nisn: '', 
  fullName: '',
  gender: 'Laki-laki',
})

const loading = ref(false)
const error = ref(null)

// Fungsi untuk mengirim data ke Backend API
const submitForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    await api.post('/students', form.value)
    alert('Data siswa berhasil ditambahkan!')
    // Kembali ke halaman daftar siswa setelah sukses
    router.push('/students')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menyimpan data. Pastikan NIS/NISN belum terdaftar dan backend menyala.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="student-create">
    <h1>Tambah Siswa Baru</h1>
    
    <div v-if="error" class="error-box">{{ error }}</div>

    <form @submit.prevent="submitForm" class="form-container">
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
          {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.student-create {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}
.error-box {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}
.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn-save {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-save:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
.btn-cancel {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>