<template>
  <div class="form-page">
    <div class="form-container">

      <!-- HEADER -->
      <div class="form-header">
        <div>
          <h1>Tambah Pelanggaran</h1>
          <p>Tambahkan data pelanggaran siswa</p>
        </div>

        <button
          type="button"
          class="btn-back"
          @click="goBack"
        >
          ← Kembali
        </button>
      </div>

      <!-- ERROR -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- FORM -->
      <form @submit.prevent="saveViolation">

        <!-- JENIS PELANGGARAN -->
        <div class="form-group">
          <label for="violationType">
            Jenis Pelanggaran <span>*</span>
          </label>

          <input
            id="violationType"
            v-model="form.violationType"
            type="text"
            placeholder="Contoh: Terlambat"
            required
          />
        </div>

        <!-- TINGKAT -->
        <div class="form-group">
          <label for="level">
            Tingkat Pelanggaran
          </label>

          <select
            id="level"
            v-model="form.level"
          >
            <option value="">Pilih tingkat</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>

        <!-- POIN -->
        <div class="form-group">
          <label for="points">
            Poin Pelanggaran
          </label>

          <input
            id="points"
            v-model="form.points"
            type="number"
            min="0"
            placeholder="Contoh: 10"
          />
        </div>

        <!-- TANGGAL -->
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

        <!-- SANKSI -->
        <div class="form-group">
          <label for="sanction">
            Sanksi
          </label>

          <input
            id="sanction"
            v-model="form.sanction"
            type="text"
            placeholder="Contoh: Teguran"
          />
        </div>

        <!-- STATUS -->
        <div class="form-group">
          <label for="status">
            Status
          </label>

          <select
            id="status"
            v-model="form.status"
          >
            <option value="ACTIVE">Aktif</option>
            <option value="COMPLETED">Selesai</option>
          </select>
        </div>

        <!-- KETERANGAN -->
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

        <!-- BUTTON -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="goBack"
          >
            Batal
          </button>

          <button
            type="submit"
            class="btn-save"
            :disabled="loading"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan Pelanggaran' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

const studentId = route.params.id

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  violationType: '',
  level: '',
  points: '',
  violationDate: '',
  sanction: '',
  status: 'ACTIVE',
  description: ''
})

// ==========================================
// SIMPAN PELANGGARAN
// ==========================================

const saveViolation = async () => {
  errorMessage.value = ''

  if (!form.violationType.trim()) {
    errorMessage.value = 'Jenis pelanggaran wajib diisi.'
    return
  }

  if (!form.violationDate) {
    errorMessage.value = 'Tanggal pelanggaran wajib diisi.'
    return
  }

  try {
    loading.value = true

    await api.post(
      `/students/${studentId}/violations`,
      {
        violationType: form.violationType,
        level: form.level,
        points: form.points,
        violationDate: form.violationDate,
        sanction: form.sanction,
        status: form.status,
        description: form.description
      }
    )

    router.push(`/students/${studentId}`)
  } catch (error) {
    console.error('Error menyimpan pelanggaran:', error)

    errorMessage.value =
      error.response?.data?.message ||
      'Gagal menyimpan data pelanggaran.'
  } finally {
    loading.value = false
  }
}

// ==========================================
// KEMBALI
// ==========================================

const goBack = () => {
  router.push(`/students/${studentId}`)
}
</script>

<style scoped>
.form-page {
  min-height: 100vh;
  padding: 30px;
  background: #f5f7fa;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}

.form-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
  color: #1f2937;
}

.form-header p {
  margin: 0;
  color: #6b7280;
}

.btn-back {
  border: none;
  background: #f3f4f6;
  color: #374151;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: #e5e7eb;
}

.error-message {
  margin-bottom: 20px;
  padding: 12px 15px;
  border-radius: 8px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
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
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
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

.btn-cancel,
.btn-save {
  border: none;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-save {
  background: #2563eb;
  color: white;
}

.btn-save:hover {
  background: #1d4ed8;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .form-page {
    padding: 15px;
  }

  .form-container {
    padding: 20px;
  }

  .form-header {
    flex-direction: column;
  }

  .btn-back {
    width: 100%;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>