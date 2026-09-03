<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Tambah Perkembangan Siswa</h1>
        <p>Tambahkan data perkembangan siswa berdasarkan tahun ajaran dan semester.</p>
      </div>

      <button class="btn btn-secondary" @click="goBack">
        Kembali
      </button>
    </div>

    <div class="form-card">
      <form @submit.prevent="submitForm">

        <!-- Tahun Ajaran -->
        <div class="form-group">
          <label for="academicYear">Tahun Ajaran</label>
          <input
            id="academicYear"
            v-model="form.academicYear"
            type="text"
            placeholder="Contoh: 2025/2026"
            required
          />
        </div>

        <!-- Semester -->
        <div class="form-group">
          <label for="semester">Semester</label>
          <select
            id="semester"
            v-model="form.semester"
            required
          >
            <option value="" disabled>Pilih Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        <!-- Tinggi Badan -->
        <div class="form-group">
          <label for="height">Tinggi Badan (cm)</label>
          <input
            id="height"
            v-model="form.height"
            type="number"
            step="0.1"
            min="0"
            placeholder="Contoh: 160"
          />
        </div>

        <!-- Berat Badan -->
        <div class="form-group">
          <label for="weight">Berat Badan (kg)</label>
          <input
            id="weight"
            v-model="form.weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="Contoh: 50"
          />
        </div>

        <!-- Akademik -->
        <div class="form-group">
          <label for="academic">Perkembangan Akademik</label>
          <textarea
            id="academic"
            v-model="form.academic"
            rows="4"
            placeholder="Tuliskan perkembangan akademik siswa..."
          ></textarea>
        </div>

        <!-- Sikap -->
        <div class="form-group">
          <label for="attitude">Sikap</label>
          <textarea
            id="attitude"
            v-model="form.attitude"
            rows="4"
            placeholder="Tuliskan perkembangan sikap siswa..."
          ></textarea>
        </div>

        <!-- Sosial -->
        <div class="form-group">
          <label for="social">Perkembangan Sosial</label>
          <textarea
            id="social"
            v-model="form.social"
            rows="4"
            placeholder="Tuliskan perkembangan sosial siswa..."
          ></textarea>
        </div>

        <!-- Catatan -->
        <div class="form-group">
          <label for="notes">Catatan</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="4"
            placeholder="Tambahkan catatan jika diperlukan..."
          ></textarea>
        </div>

        <!-- Action -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="goBack"
          >
            Batal
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../services/api";

const route = useRoute();
const router = useRouter();

const studentId = route.params.studentId;

const loading = ref(false);

const form = ref({
  academicYear: "",
  semester: "",
  height: "",
  weight: "",
  academic: "",
  attitude: "",
  social: "",
  notes: "",
});

const submitForm = async () => {
  loading.value = true;

  try {
    await api.post(
      `/students/${studentId}/developments`,
      form.value
    );

    alert("Data perkembangan siswa berhasil ditambahkan.");

    router.push(`/students/${studentId}`);
  } catch (error) {
    console.error("Error menambahkan perkembangan siswa:", error);

    alert(
      error.response?.data?.message ||
      "Gagal menambahkan data perkembangan siswa."
    );
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push(`/students/${studentId}`);
};
</script>

<style scoped>
.page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #666;
}

.form-card {
  max-width: 800px;
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .form-card {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>