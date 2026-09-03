<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const saving = ref(false)
const error = ref(null)

const form = ref({
  academicYear: '',
  semester: '1',
  subject: '',
  knowledge: '',
  skill: '',
  finalScore: '',
  predicate: '',
  description: ''
})

const saveGrade = async () => {
  if (!form.value.academicYear) {
    alert('Tahun ajaran wajib diisi.')
    return
  }

  if (!form.value.subject) {
    alert('Mata pelajaran wajib diisi.')
    return
  }

  try {
    saving.value = true
    error.value = null

    const studentId = route.params.studentId

    await api.post(
      `/students/${studentId}/grades`,
      {
        academicYear: form.value.academicYear,
        semester: form.value.semester,
        subject: form.value.subject,

        knowledge:
          form.value.knowledge !== ''
            ? Number(form.value.knowledge)
            : null,

        skill:
          form.value.skill !== ''
            ? Number(form.value.skill)
            : null,

        finalScore:
          form.value.finalScore !== ''
            ? Number(form.value.finalScore)
            : null,

        predicate:
          form.value.predicate || null,

        description:
          form.value.description || null
      }
    )

    alert('Data nilai berhasil ditambahkan.')

    router.push(
      `/students/${studentId}`
    )

  } catch (err) {
    console.error(
      'Error menambahkan data nilai:',
      err
    )

    error.value =
      err.response?.data?.message ||
      'Gagal menambahkan data nilai.'
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  const studentId = route.params.studentId

  router.push(
    `/students/${studentId}`
  )
}
</script>


<template>

  <main class="grade-create">

    <div class="page-header">

      <div>
        <h1>Tambah Nilai / Rapor</h1>

        <p>
          Tambahkan nilai akademik siswa
        </p>
      </div>

    </div>


    <!-- ERROR -->

    <div
      v-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <form
      class="form-container"
      @submit.prevent="saveGrade"
    >

      <!-- ================================ -->
      <!-- INFORMASI RAPOR -->
      <!-- ================================ -->

      <section class="form-section">

        <h2>
          Informasi Rapor
        </h2>


        <div class="form-grid">

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

        </div>

      </section>


      <!-- ================================ -->
      <!-- MATA PELAJARAN -->
      <!-- ================================ -->

      <section class="form-section">

        <h2>
          Mata Pelajaran
        </h2>


        <div class="form-group">

          <label>
            Mata Pelajaran
            <span>*</span>
          </label>

          <input
            v-model="form.subject"
            type="text"
            placeholder="Contoh: Matematika"
          />

        </div>

      </section>


      <!-- ================================ -->
      <!-- NILAI -->
      <!-- ================================ -->

      <section class="form-section">

        <h2>
          Nilai
        </h2>


        <div class="form-grid">


          <!-- PENGETAHUAN -->

          <div class="form-group">

            <label>
              Nilai Pengetahuan
            </label>

            <input
              v-model="form.knowledge"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0 - 100"
            />

          </div>


          <!-- KETERAMPILAN -->

          <div class="form-group">

            <label>
              Nilai Keterampilan
            </label>

            <input
              v-model="form.skill"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0 - 100"
            />

          </div>


          <!-- NILAI AKHIR -->

          <div class="form-group">

            <label>
              Nilai Akhir
            </label>

            <input
              v-model="form.finalScore"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0 - 100"
            />

          </div>


          <!-- PREDIKAT -->

          <div class="form-group">

            <label>
              Predikat
            </label>

            <select
              v-model="form.predicate"
            >

              <option value="">
                Pilih Predikat
              </option>

              <option value="A">
                A
              </option>

              <option value="B">
                B
              </option>

              <option value="C">
                C
              </option>

              <option value="D">
                D
              </option>

            </select>

          </div>

        </div>

      </section>


      <!-- ================================ -->
      <!-- DESKRIPSI -->
      <!-- ================================ -->

      <section class="form-section">

        <h2>
          Deskripsi
        </h2>


        <div class="form-group">

          <label>
            Deskripsi / Catatan
          </label>

          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Tuliskan deskripsi perkembangan atau pencapaian siswa..."
          ></textarea>

        </div>

      </section>


      <!-- ================================ -->
      <!-- BUTTON -->
      <!-- ================================ -->

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
              : 'Simpan Nilai'
          }}

        </button>

      </div>

    </form>

  </main>

</template>


<style scoped>

.grade-create {

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


/* ================================ */
/* ERROR */
/* ================================ */

.error-box {

  padding: 15px;

  margin-bottom: 20px;

  background-color: #ffebee;

  color: #c62828;

  border-radius: 6px;

}


/* ================================ */
/* FORM */
/* ================================ */

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


/* ================================ */
/* BUTTON */
/* ================================ */

.button-group {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

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


/* ================================ */
/* RESPONSIVE */
/* ================================ */

@media (max-width: 600px) {

  .grade-create {

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