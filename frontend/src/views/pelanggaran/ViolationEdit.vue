<template>
  <div class="violation-edit-page">
    <div class="page-header">
      <div>
        <h1>Edit Pelanggaran</h1>
        <p>Perbarui data pelanggaran siswa</p>
      </div>
    </div>

    <div class="form-card">
      <form @submit.prevent="updateViolation">
        <!-- Jenis Pelanggaran -->
        <div class="form-group">
          <label for="violationType">
            Jenis Pelanggaran <span>*</span>
          </label>

          <input
            id="violationType"
            v-model="form.violationType"
            type="text"
            placeholder="Contoh: Terlambat masuk sekolah"
            required
          />
        </div>

        <!-- Tingkat Pelanggaran -->
        <div class="form-group">
          <label for="level">Tingkat Pelanggaran</label>

          <select id="level" v-model="form.level">
            <option value="">-- Pilih Tingkat --</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>

        <!-- Poin -->
        <div class="form-group">
          <label for="points">Poin</label>

          <input
            id="points"
            v-model="form.points"
            type="number"
            min="0"
            placeholder="Contoh: 10"
          />
        </div>

        <!-- Tanggal Pelanggaran -->
        <div class="form-group">
          <label for="violationDate">
            Tanggal Pelanggaran <span>*</span>
          </label>

          <input
            id="violationDate"
            v-model="form.violationDate"
            type="date"
            required
          />
        </div>

        <!-- Sanksi -->
        <div class="form-group">
          <label for="sanction">Sanksi</label>

          <input
            id="sanction"
            v-model="form.sanction"
            type="text"
            placeholder="Contoh: Teguran lisan"
          />
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status</label>

          <select id="status" v-model="form.status">
            <option value="ACTIVE">Aktif</option>
            <option value="COMPLETED">Selesai</option>
          </select>
        </div>

        <!-- Deskripsi -->
        <div class="form-group">
          <label for="description">Keterangan</label>

          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            placeholder="Tambahkan keterangan jika diperlukan"
          ></textarea>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Button -->
        <div class="form-actions">
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
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

// ID siswa
const studentId = route.params.id

// ID pelanggaran
const violationId = route.params.violationId

const loading = ref(true)
const saving = ref(false)

const errorMessage = ref('')

const form = ref({
  violationType: '',
  level: '',
  points: '',
  violationDate: '',
  sanction: '',
  status: 'ACTIVE',
  description: ''
})

// Format tanggal dari database menjadi YYYY-MM-DD
const formatDateForInput = (date) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    parsedDate.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Ambil data pelanggaran
const fetchViolation = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await api.get(
      `/violations/${violationId}`
    )

    const violation = response.data

    form.value = {
      violationType: violation.violationType || '',
      level: violation.level || '',
      points:
        violation.points !== null &&
        violation.points !== undefined
          ? violation.points
          : '',
      violationDate: formatDateForInput(
        violation.violationDate
      ),
      sanction: violation.sanction || '',
      status: violation.status || 'ACTIVE',
      description: violation.description || ''
    }
  } catch (error) {
    console.error(
      'Error mengambil data pelanggaran:',
      error
    )

    errorMessage.value =
      error.response?.data?.message ||
      'Gagal mengambil data pelanggaran.'
  } finally {
    loading.value = false
  }
}

// Update data pelanggaran
const updateViolation = async () => {
  try {
    saving.value = true
    errorMessage.value = ''

    if (
      !form.value.violationType ||
      !form.value.violationType.trim()
    ) {
      errorMessage.value =
        'Jenis pelanggaran wajib diisi.'
      return
    }

    if (!form.value.violationDate) {
      errorMessage.value =
        'Tanggal pelanggaran wajib diisi.'
      return
    }

    await api.put(
      `/violations/${violationId}`,
      {
        violationType:
          form.value.violationType.trim(),

        level:
          form.value.level
            ? form.value.level.trim()
            : null,

        points:
          form.value.points !== '' &&
          form.value.points !== null
            ? Number(form.value.points)
            : null,

        violationDate:
          form.value.violationDate,

        sanction:
          form.value.sanction
            ? form.value.sanction.trim()
            : null,

        status:
          form.value.status || 'ACTIVE',

        description:
          form.value.description
            ? form.value.description.trim()
            : null
      }
    )

    alert(
      'Data pelanggaran berhasil diperbarui.'
    )

    router.push(
      `/students/${studentId}`
    )
  } catch (error) {
    console.error(
      'Error mengubah data pelanggaran:',
      error
    )

    errorMessage.value =
      error.response?.data?.message ||
      'Gagal mengubah data pelanggaran.'
  } finally {
    saving.value = false
  }
}

// Kembali ke detail siswa
const goBack = () => {
  router.push(
    `/students/${studentId}`
  )
}

onMounted(() => {
  fetchViolation()
})
</script>

<style scoped>
.violation-edit-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

.page-header {
  margin-bottom: 25px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #1f2937;
}

.page-header p {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group label span {
  color: #dc2626;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  transition: border-color 0.2s,
    box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  margin-bottom: 20px;
  padding: 12px 15px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel,
.btn-save {
  border: none;
  border-radius: 8px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover:not(:disabled) {
  background: #d1d5db;
}

.btn-save {
  background: #2563eb;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-cancel:disabled,
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .violation-edit-page {
    padding: 20px;
  }

  .form-card {
    padding: 20px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>