<template>

  <div class="grade-edit">

    <div v-if="loading" class="loading">
      Memuat data nilai...
    </div>

    <div v-else-if="error" class="error-box">
      {{ error }}
    </div>

    <div v-else class="form-container">

      <div class="form-header">

        <div>
          <h1>Edit Nilai / Rapor</h1>

          <p v-if="studentName">
            Siswa: <strong>{{ studentName }}</strong>
          </p>
        </div>

      </div>


      <form @submit.prevent="updateGrade">


        <!-- =============================== -->
        <!-- TAHUN AJARAN -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="academicYear">
            Tahun Ajaran
          </label>

          <input
            id="academicYear"
            v-model="form.academicYear"
            type="text"
            placeholder="Contoh: 2025/2026"
            required
          />

        </div>


        <!-- =============================== -->
        <!-- SEMESTER -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="semester">
            Semester
          </label>

          <select
            id="semester"
            v-model="form.semester"
            required
          >

            <option value="">
              Pilih Semester
            </option>

            <option value="1">
              Semester 1
            </option>

            <option value="2">
              Semester 2
            </option>

          </select>

        </div>


        <!-- =============================== -->
        <!-- MATA PELAJARAN -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="subject">
            Mata Pelajaran
          </label>

          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="Contoh: Matematika"
            required
          />

        </div>


        <!-- =============================== -->
        <!-- NILAI PENGETAHUAN -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="knowledge">
            Nilai Pengetahuan
          </label>

          <input
            id="knowledge"
            v-model="form.knowledge"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
          />

        </div>


        <!-- =============================== -->
        <!-- NILAI KETERAMPILAN -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="skill">
            Nilai Keterampilan
          </label>

          <input
            id="skill"
            v-model="form.skill"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
          />

        </div>


        <!-- =============================== -->
        <!-- NILAI AKHIR -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="finalScore">
            Nilai Akhir
          </label>

          <input
            id="finalScore"
            v-model="form.finalScore"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
          />

        </div>


        <!-- =============================== -->
        <!-- PREDIKAT -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="predicate">
            Predikat
          </label>

          <select
            id="predicate"
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


        <!-- =============================== -->
        <!-- DESKRIPSI -->
        <!-- =============================== -->

        <div class="form-group">

          <label for="description">
            Deskripsi
          </label>

          <textarea
            id="description"
            v-model="form.description"
            rows="5"
            placeholder="Masukkan deskripsi nilai..."
          ></textarea>

        </div>


        <!-- =============================== -->
        <!-- BUTTON -->
        <!-- =============================== -->

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

            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}

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


/* ================================= */
/* ROUTER */
/* ================================= */

const router = useRouter()
const route = useRoute()


/* ================================= */
/* STATE */
/* ================================= */

const loading = ref(true)

const saving = ref(false)

const error = ref(null)

const studentName = ref('')


/* ================================= */
/* FORM */
/* ================================= */

const form = ref({

  academicYear: '',

  semester: '',

  subject: '',

  knowledge: '',

  skill: '',

  finalScore: '',

  predicate: '',

  description: ''

})


/* ================================= */
/* GET GRADE */
/* ================================= */

const fetchGrade = async () => {

  try {

    loading.value = true

    error.value = null

    const gradeId = route.params.gradeId

    const response = await api.get(`/grades/${gradeId}`)

    const grade = response.data


    form.value = {

      academicYear: grade.academicYear || '',

      semester: grade.semester || '',

      subject: grade.subject || '',

      knowledge: grade.knowledge ?? '',

      skill: grade.skill ?? '',

      finalScore: grade.finalScore ?? '',

      predicate: grade.predicate || '',

      description: grade.description || ''

    }


    if (grade.student) {

      studentName.value = grade.student.fullName || ''

    }


  } catch (err) {

    console.error('Error mengambil data nilai:', err)

    error.value =
      err.response?.data?.message ||
      'Gagal memuat data nilai.'

  } finally {

    loading.value = false

  }

}


/* ================================= */
/* UPDATE GRADE */
/* ================================= */

const updateGrade = async () => {

  try {

    saving.value = true

    error.value = null


    const gradeId = route.params.gradeId

    const studentId = route.params.studentId


    /* =============================== */
    /* VALIDASI NILAI */
    /* =============================== */

    const scores = [

      {
        name: 'Nilai Pengetahuan',
        value: form.value.knowledge
      },

      {
        name: 'Nilai Keterampilan',
        value: form.value.skill
      },

      {
        name: 'Nilai Akhir',
        value: form.value.finalScore
      }

    ]


    for (const score of scores) {

      if (
        score.value !== '' &&
        score.value !== null &&
        score.value !== undefined
      ) {

        const number = Number(score.value)

        if (
          Number.isNaN(number) ||
          number < 0 ||
          number > 100
        ) {

          alert(
            `${score.name} harus berada di antara 0 sampai 100.`
          )

          saving.value = false

          return

        }

      }

    }


    /* =============================== */
    /* DATA YANG DIKIRIM */
/* =============================== */

    const payload = {

      academicYear: form.value.academicYear,

      semester: form.value.semester,

      subject: form.value.subject,

      knowledge:
        form.value.knowledge === ''
          ? null
          : Number(form.value.knowledge),

      skill:
        form.value.skill === ''
          ? null
          : Number(form.value.skill),

      finalScore:
        form.value.finalScore === ''
          ? null
          : Number(form.value.finalScore),

      predicate:
        form.value.predicate || null,

      description:
        form.value.description || null

    }


    /* =============================== */
    /* PUT */
    /* =============================== */

    await api.put(
      `/grades/${gradeId}`,
      payload
    )


    alert('Data nilai berhasil diperbarui.')


    /* =============================== */
    /* KEMBALI KE DETAIL SISWA */
    /* =============================== */

    router.push(`/students/${studentId}`)


  } catch (err) {

    console.error(
      'Error memperbarui data nilai:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal memperbarui data nilai.'
    )

  } finally {

    saving.value = false

  }

}


/* ================================= */
/* BACK */
/* ================================= */

const goBack = () => {

  const studentId = route.params.studentId

  router.push(`/students/${studentId}`)

}


/* ================================= */
/* ON MOUNTED */
/* ================================= */

onMounted(() => {

  fetchGrade()

})

</script>


<style scoped>

/* ================================= */
/* MAIN */
/* ================================= */

.grade-edit {

  padding: 2rem;

  max-width: 700px;

  margin: 0 auto;

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

  background-color: #ffebee;

  color: #c62828;

  padding: 15px;

  border-radius: 6px;

}


/* ================================= */
/* FORM CONTAINER */
/* ================================= */

.form-container {

  background-color: white;

  padding: 25px;

  border-radius: 8px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1);

}


/* ================================= */
/* HEADER */
/* ================================= */

.form-header {

  margin-bottom: 25px;

}


.form-header h1 {

  margin-top: 0;

  margin-bottom: 8px;

  font-size: 24px;

}


.form-header p {

  margin: 0;

  color: #666;

}


/* ================================= */
/* FORM GROUP */
/* ================================= */

.form-group {

  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-bottom: 18px;

}


.form-group label {

  font-size: 14px;

  font-weight: bold;

  color: #555;

}


/* ================================= */
/* INPUT */
/* ================================= */

.form-group input,
.form-group select,
.form-group textarea {

  width: 100%;

  box-sizing: border-box;

  padding: 10px 12px;

  border: 1px solid #ccc;

  border-radius: 5px;

  font-size: 14px;

  font-family: inherit;

  outline: none;

}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {

  border-color: #2196f3;

}


/* ================================= */
/* TEXTAREA */
/* ================================= */

.form-group textarea {

  resize: vertical;

}


/* ================================= */
/* BUTTON GROUP */
/* ================================= */

.button-group {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 25px;

}


.button-group button {

  padding: 10px 20px;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  transition: opacity 0.2s ease;

}


/* ================================= */
/* CANCEL */
/* ================================= */

.btn-cancel {

  background-color: #757575;

  color: white;

}


/* ================================= */
/* SAVE */
/* ================================= */

.btn-save {

  background-color: #2196f3;

  color: white;

}


/* ================================= */
/* HOVER */
/* ================================= */

.button-group button:hover:not(:disabled) {

  opacity: 0.9;

}


/* ================================= */
/* DISABLED */
/* ================================= */

.button-group button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


/* ================================= */
/* RESPONSIVE */
/* ================================= */

@media (max-width: 600px) {

  .grade-edit {

    padding: 1rem;

  }


  .form-container {

    padding: 20px;

  }


  .form-header h1 {

    font-size: 21px;

  }


  .button-group {

    flex-direction: column;

  }


  .button-group button {

    width: 100%;

  }

}

</style>