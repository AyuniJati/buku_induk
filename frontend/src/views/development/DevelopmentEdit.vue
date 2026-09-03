<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const saving = ref(false)
const error = ref(null)

const form = ref({
  academicYear: '',
  semester: '1',
  height: '',
  weight: '',
  academic: '',
  attitude: '',
  social: '',
  notes: ''
})


// ==========================================
// AMBIL DATA PERKEMBANGAN
// ==========================================

const fetchDevelopment = async () => {

  try {

    const developmentId = route.params.developmentId

    const response = await api.get(
      `/developments/${developmentId}`
    )

    const data = response.data

    form.value = {
      academicYear: data.academicYear || '',
      semester: data.semester || '1',
      height: data.height ?? '',
      weight: data.weight ?? '',
      academic: data.academic || '',
      attitude: data.attitude || '',
      social: data.social || '',
      notes: data.notes || ''
    }

  } catch (err) {

    console.error(
      'Error mengambil data perkembangan:',
      err
    )

    error.value =
      'Gagal memuat data perkembangan siswa.'

  } finally {

    loading.value = false

  }

}


// ==========================================
// UPDATE DATA
// ==========================================

const updateDevelopment = async () => {

  if (!form.value.academicYear) {

    alert(
      'Tahun ajaran wajib diisi.'
    )

    return

  }

  if (!form.value.semester) {

    alert(
      'Semester wajib dipilih.'
    )

    return

  }

  try {

    saving.value = true

    error.value = null

    const developmentId =
      route.params.developmentId

    await api.put(
      `/developments/${developmentId}`,
      {
        academicYear:
          form.value.academicYear,

        semester:
          form.value.semester,

        height:
          form.value.height !== ''
            ? Number(form.value.height)
            : null,

        weight:
          form.value.weight !== ''
            ? Number(form.value.weight)
            : null,

        academic:
          form.value.academic || null,

        attitude:
          form.value.attitude || null,

        social:
          form.value.social || null,

        notes:
          form.value.notes || null
      }
    )

    alert(
      'Data perkembangan siswa berhasil diperbarui.'
    )

    const studentId =
      route.params.studentId

    router.push(
      `/students/${studentId}`
    )

  } catch (err) {

    console.error(
      'Error mengupdate data perkembangan:',
      err
    )

    error.value =
      err.response?.data?.message ||
      'Gagal memperbarui data perkembangan siswa.'

  } finally {

    saving.value = false

  }

}


// ==========================================
// KEMBALI
// ==========================================

const goBack = () => {

  const studentId =
    route.params.studentId

  router.push(
    `/students/${studentId}`
  )

}


// ==========================================
// LOAD DATA
// ==========================================

onMounted(() => {

  fetchDevelopment()

})
</script>


<template>

  <main class="development-edit">

    <div class="page-header">

      <div>

        <h1>
          Edit Perkembangan Siswa
        </h1>

        <p>
          Perbarui data perkembangan siswa
        </p>

      </div>

    </div>


    <!-- LOADING -->

    <div
      v-if="loading"
      class="loading"
    >
      Memuat data perkembangan siswa...
    </div>


    <!-- ERROR -->

    <div
      v-else-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <!-- FORM -->

    <form
      v-else
      class="form-container"
      @submit.prevent="updateDevelopment"
    >


      <!-- ================================= -->
      <!-- INFORMASI AKADEMIK -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>
          Informasi Periode
        </h2>


        <!-- TAHUN AJARAN -->

        <div class="form-group">

          <label>
            Tahun Ajaran
            <span>*</span>
          </label>

          <input
            v-model="form.academicYear"
            type="text"
            placeholder="Contoh: 2025/2026"
          />

        </div>


        <!-- SEMESTER -->

        <div class="form-group">

          <label>
            Semester
            <span>*</span>
          </label>

          <select
            v-model="form.semester"
          >

            <option value="1">
              Semester 1
            </option>

            <option value="2">
              Semester 2
            </option>

          </select>

        </div>

      </section>


      <!-- ================================= -->
      <!-- PERTUMBUHAN FISIK -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>
          Pertumbuhan Fisik
        </h2>


        <div class="form-grid">


          <!-- TINGGI -->

          <div class="form-group">

            <label>
              Tinggi Badan (cm)
            </label>

            <input
              v-model="form.height"
              type="number"
              step="0.1"
              min="0"
              placeholder="Contoh: 165"
            />

          </div>


          <!-- BERAT -->

          <div class="form-group">

            <label>
              Berat Badan (kg)
            </label>

            <input
              v-model="form.weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="Contoh: 55"
            />

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- PERKEMBANGAN -->
      <!-- ================================= -->

      <section class="form-section">

        <h2>
          Perkembangan Siswa
        </h2>


        <!-- AKADEMIK -->

        <div class="form-group">

          <label>
            Akademik
          </label>

          <textarea
            v-model="form.academic"
            rows="4"
            placeholder="Tuliskan perkembangan akademik siswa..."
          ></textarea>

        </div>


        <!-- SIKAP -->

        <div class="form-group">

          <label>
            Sikap
          </label>

          <textarea
            v-model="form.attitude"
            rows="4"
            placeholder="Tuliskan perkembangan sikap siswa..."
          ></textarea>

        </div>


        <!-- SOSIAL -->

        <div class="form-group">

          <label>
            Sosial
          </label>

          <textarea
            v-model="form.social"
            rows="4"
            placeholder="Tuliskan perkembangan sosial siswa..."
          ></textarea>

        </div>


        <!-- CATATAN -->

        <div class="form-group">

          <label>
            Catatan
          </label>

          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="Tambahkan catatan lainnya..."
          ></textarea>

        </div>

      </section>


      <!-- ================================= -->
      <!-- BUTTON -->
      <!-- ================================= -->

      <div class="button-group">

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

          {{
            saving
              ? 'Menyimpan...'
              : 'Simpan Perubahan'
          }}

        </button>

      </div>

    </form>

  </main>

</template>


<style scoped>

.development-edit {

  max-width: 800px;

  margin: 0 auto;

  padding: 2rem;

}


.page-header {

  margin-bottom: 25px;

}


.page-header h1 {

  margin: 0 0 8px;

}


.page-header p {

  margin: 0;

  color: #777;

}


/* ================================= */
/* LOADING */
/* ================================= */

.loading {

  padding: 30px;

  text-align: center;

}


/* ================================= */
/* ERROR */
/* ================================= */

.error-box {

  padding: 15px;

  background-color: #ffebee;

  color: #c62828;

  border-radius: 6px;

}


/* ================================= */
/* FORM */
/* ================================= */

.form-container {

  display: flex;

  flex-direction: column;

  gap: 20px;

}


.form-section {

  background-color: white;

  padding: 20px;

  border-radius: 8px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1);

}


.form-section h2 {

  margin-top: 0;

  margin-bottom: 20px;

  padding-bottom: 10px;

  border-bottom: 1px solid #ddd;

}


.form-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;

}


.form-group {

  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-bottom: 15px;

}


.form-group:last-child {

  margin-bottom: 0;

}


.form-group label {

  font-weight: bold;

  font-size: 14px;

  color: #444;

}


.form-group label span {

  color: #f44336;

}


.form-group input,
.form-group select,
.form-group textarea {

  width: 100%;

  box-sizing: border-box;

  padding: 10px 12px;

  border: 1px solid #ccc;

  border-radius: 5px;

  font-family: inherit;

  font-size: 14px;

}


.form-group textarea {

  resize: vertical;

}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {

  outline: none;

  border-color: #2196f3;

}


/* ================================= */
/* BUTTON */
/* ================================= */

.button-group {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 5px;

}


.button-group button {

  padding: 11px 20px;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  font-size: 14px;

}


.btn-cancel {

  background-color: #757575;

  color: white;

}


.btn-save {

  background-color: #2196f3;

  color: white;

}


.button-group button:hover {

  opacity: 0.9;

}


.button-group button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


/* ================================= */
/* RESPONSIVE */
/* ================================= */

@media (max-width: 600px) {

  .development-edit {

    padding: 1rem;

  }


  .form-grid {

    grid-template-columns: 1fr;

  }


  .button-group {

    flex-direction: column;

  }


  .button-group button {

    width: 100%;

  }

}

</style>