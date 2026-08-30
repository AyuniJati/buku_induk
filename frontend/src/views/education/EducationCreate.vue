<script setup>

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

// ==========================================
// FORM
// ==========================================

const form = ref({

  schoolOrigin: '',
  nisOrigin: '',
  yearEntry: '',
  className: '',
  major: '',
  status: 'ACTIVE'

})


// ==========================================
// STATE
// ==========================================

const loading = ref(false)
const error = ref(null)


// ==========================================
// SUBMIT
// ==========================================

const submitForm = async () => {

  loading.value = true
  error.value = null

  try {

    const studentId = route.params.studentId

    await api.post(
      `/students/${studentId}/education`,
      form.value
    )

    alert(
      'Data pendidikan berhasil ditambahkan!'
    )

    router.push(
      `/students/${studentId}`
    )

  } catch (err) {

    console.error(
      'Error menambahkan data pendidikan:',
      err
    )

    error.value =
      err.response?.data?.message ||
      'Gagal menambahkan data pendidikan.'

  } finally {

    loading.value = false

  }

}


// ==========================================
// BATAL
// ==========================================

const cancel = () => {

  router.push(
    `/students/${route.params.studentId}`
  )

}

</script>


<template>

  <main class="education-page">

    <h1>
      Tambah Data Pendidikan
    </h1>


    <!-- ERROR -->

    <div
      v-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <!-- FORM -->

    <form
      class="form-container"
      @submit.prevent="submitForm"
    >


      <!-- SEKOLAH ASAL -->

      <div class="form-group">

        <label>
          Sekolah Asal
        </label>

        <input
          type="text"
          v-model="form.schoolOrigin"
          placeholder="Nama sekolah asal"
        />

      </div>


      <!-- NIS ASAL -->

      <div class="form-group">

        <label>
          NIS Sekolah Asal
        </label>

        <input
          type="text"
          v-model="form.nisOrigin"
          placeholder="Nomor induk dari sekolah asal"
        />

      </div>


      <!-- TAHUN MASUK -->

      <div class="form-group">

        <label>
          Tahun Masuk
        </label>

        <input
          type="number"
          v-model="form.yearEntry"
          placeholder="Contoh: 2024"
        />

      </div>


      <!-- KELAS -->

      <div class="form-group">

        <label>
          Kelas
        </label>

        <input
          type="text"
          v-model="form.className"
          placeholder="Contoh: XII RPL 1"
        />

      </div>


      <!-- JURUSAN -->

      <div class="form-group">

        <label>
          Jurusan
        </label>

        <input
          type="text"
          v-model="form.major"
          placeholder="Contoh: Rekayasa Perangkat Lunak"
        />

      </div>


      <!-- STATUS -->

      <div class="form-group">

        <label>
          Status Pendidikan
        </label>

        <select
          v-model="form.status"
        >

          <option value="ACTIVE">
            Aktif
          </option>

          <option value="LULUS">
            Lulus
          </option>

          <option value="PINDAH">
            Pindah
          </option>

          <option value="NONACTIVE">
            Tidak Aktif
          </option>

        </select>

      </div>


      <!-- BUTTON -->

      <div class="button-group">

        <button
          type="button"
          class="btn-cancel"
          @click="cancel"
        >
          Batal
        </button>


        <button
          type="submit"
          class="btn-save"
          :disabled="loading"
        >

          {{
            loading
              ? 'Menyimpan...'
              : 'Simpan Data'
          }}

        </button>

      </div>

    </form>

  </main>

</template>


<style scoped>

.education-page {

  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;

}

.form-container {

  background: white;
  padding: 25px;
  border-radius: 8px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1);

}

.form-group {

  margin-bottom: 15px;

}

.form-group label {

  display: block;
  margin-bottom: 6px;
  font-weight: bold;

}

.form-group input,
.form-group select {

  width: 100%;
  padding: 9px;

  border: 1px solid #ccc;
  border-radius: 4px;

  box-sizing: border-box;

}

.error-box {

  background-color: #ffebee;
  color: #c62828;

  padding: 15px;
  border-radius: 6px;

  margin-bottom: 15px;

}

.button-group {

  margin-top: 25px;

  display: flex;
  justify-content: flex-end;

  gap: 10px;

}

.button-group button {

  padding: 10px 20px;

  border: none;
  border-radius: 5px;

  cursor: pointer;

}

.btn-save {

  background-color: #2196f3;
  color: white;

}

.btn-cancel {

  background-color: #757575;
  color: white;

}

.btn-save:disabled {

  background-color: #9e9e9e;

  cursor: not-allowed;

}

</style>