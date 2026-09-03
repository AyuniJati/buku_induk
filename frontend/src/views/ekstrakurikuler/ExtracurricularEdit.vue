<template>
  <div class="page-container">
    <div class="form-container">
      <div class="form-header">
        <div>
          <h1>Edit Ekstrakurikuler</h1>
          <p>Ubah data kegiatan ekstrakurikuler siswa.</p>
        </div>
      </div>

      <div v-if="loadingData" class="loading-message">
        Memuat data ekstrakurikuler...
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form
        v-if="!loadingData"
        @submit.prevent="updateExtracurricular"
      >
        <!-- Nama Kegiatan -->
        <div class="form-group">
          <label for="activityName">
            Nama Kegiatan <span>*</span>
          </label>

          <input
            id="activityName"
            v-model="form.activityName"
            type="text"
            placeholder="Contoh: Pramuka"
            required
          />
        </div>

        <!-- Peran / Jabatan -->
        <div class="form-group">
          <label for="role">
            Peran / Jabatan
          </label>

          <input
            id="role"
            v-model="form.role"
            type="text"
            placeholder="Contoh: Anggota / Ketua"
          />
        </div>

        <!-- Tingkat -->
        <div class="form-group">
          <label for="level">
            Tingkat
          </label>

          <select id="level" v-model="form.level">
            <option value="">-- Pilih Tingkat --</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Kecamatan">Kecamatan</option>
            <option value="Kabupaten/Kota">Kabupaten/Kota</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
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

        <!-- Status -->
        <div class="form-group">
          <label for="status">
            Status
          </label>

          <select id="status" v-model="form.status">
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Tidak Aktif</option>
          </select>
        </div>

        <!-- Keterangan -->
        <div class="form-group">
          <label for="description">
            Keterangan
          </label>

          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            placeholder="Tambahkan keterangan jika diperlukan..."
          ></textarea>
        </div>

        <!-- Tombol -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="goBack"
            :disabled="loading"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const loadingData = ref(true)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  activityName: '',
  role: '',
  level: '',
  academicYear: '',
  status: 'ACTIVE',
  description: ''
})

const fetchExtracurricular = async () => {
  try {
    loadingData.value = true
    errorMessage.value = ''

    const extracurricularId = route.params.extracurricularId

    const response = await api.get(
      `/extracurriculars/${extracurricularId}`
    )

    form.value = {
      activityName: response.data.activityName || '',
      role: response.data.role || '',
      level: response.data.level || '',
      academicYear: response.data.academicYear || '',
      status: response.data.status || 'ACTIVE',
      description: response.data.description || ''
    }
  } catch (err) {
    console.error(
      'Error mengambil data ekstrakurikuler:',
      err
    )

    errorMessage.value =
      err.response?.data?.message ||
      'Gagal memuat data ekstrakurikuler.'
  } finally {
    loadingData.value = false
  }
}

const updateExtracurricular = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const studentId = route.params.id
    const extracurricularId = route.params.extracurricularId

    await api.put(
      `/extracurriculars/${extracurricularId}`,
      form.value
    )

    alert('Data ekstrakurikuler berhasil diperbarui.')

    router.push(`/students/${studentId}`)
  } catch (err) {
    console.error(
      'Error mengubah data ekstrakurikuler:',
      err
    )

    errorMessage.value =
      err.response?.data?.message ||
      'Gagal mengubah data ekstrakurikuler.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  const studentId = route.params.id

  router.push(`/students/${studentId}`)
}

onMounted(() => {
  fetchExtracurricular()
})
</script>

<style scoped>
.page-container {
  padding: 30px;
  background-color: #f5f6fa;
  min-height: 100vh;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.form-header h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #333;
}

.form-header p {
  margin: 0;
  color: #777;
}

.loading-message {
  padding: 20px;
  text-align: center;
  color: #777;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group label span {
  color: #f44336;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4caf50;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.form-actions button {
  border: none;
  border-radius: 6px;
  padding: 11px 20px;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-save {
  background-color: #4caf50;
  color: white;
}

.btn-save:hover {
  background-color: #43a047;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .page-container {
    padding: 15px;
  }

  .form-container {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>