<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const students = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('') // State untuk kotak pencarian

// Ambil data siswa
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/students')
    students.value = response.data
  } catch (err) {
    error.value = 'Gagal memuat data siswa'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Fungsi Hapus Data
const deleteStudent = async (id, nama) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data siswa bernama ${nama}?`)) {
    try {
      await axios.delete(`http://localhost:3000/api/students/${id}`)
      alert('Data berhasil dihapus!')
      fetchStudents()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data siswa.')
    }
  }
}

// Computed property untuk memfilter siswa berdasarkan Nama atau NIS
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const query = searchQuery.value.toLowerCase()
    const fullName = student.fullName.toLowerCase()
    const nis = student.nis.toLowerCase()
    const nisn = student.nisn ? student.nisn.toLowerCase() : ''
    
    return fullName.includes(query) || nis.includes(query) || nisn.includes(query)
  })
})

onMounted(() => {
  fetchStudents()
})
</script>

<template>
  <main class="student-list">
    <h1>Daftar Siswa</h1>
    
    <div v-if="loading">Memuat data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else>
      <!-- Bagian Atas: Tombol Tambah & Kotak Pencarian -->
      <div class="action-bar">
        <button class="btn-add" @click="$router.push('/students/create')">+ Tambah Siswa Baru</button>
        
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari berdasarkan Nama, NIS, atau NISN..." 
          class="search-input"
        />
      </div>

      <table border="1" cellPadding="10" style="margin-top: 1rem; width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>NISN</th>
            <th>Nama Lengkap</th>
            <th>Jenis Kelamin</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Jika data kosong sama sekali di database -->
          <tr v-if="students.length === 0">
            <td colspan="7" style="text-align: center;">Belum ada data siswa.</td>
          </tr>
          <!-- Jika hasil pencarian tidak ditemukan -->
          <tr v-else-if="filteredStudents.length === 0">
            <td colspan="7" style="text-align: center;">Siswa yang dicari tidak ditemukan.</td>
          </tr>
          
          <!-- Looping data yang sudah difilter oleh pencarian -->
          <tr v-for="(student, index) in filteredStudents" :key="student.id">
            <td>{{ index + 1 }}</td>
            <td>{{ student.nis }}</td>
            <td>{{ student.nisn || '-' }}</td> 
            <td>{{ student.fullName }}</td>
            <td>{{ student.gender }}</td>
            <td>{{ student.status }}</td>
            <td>
              <button class="btn-edit" @click="$router.push(`/students/${student.id}/edit`)">Edit</button>
              <button class="btn-delete" @click="deleteStudent(student.id, student.fullName)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.student-list {
  padding: 2rem;
}
.error {
  color: red;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search-input {
  padding: 8px 12px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-add {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.btn-edit {
  padding: 5px 10px;
  background-color: #ff9800;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
}
.btn-delete {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>