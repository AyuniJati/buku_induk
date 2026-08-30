<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

// ==========================================
// STATE
// ==========================================

const student = ref(null)
const parents = ref([])
const education = ref(null)

const loading = ref(true)
const parentsLoading = ref(false)
const educationLoading = ref(false)

const error = ref(null)
const parentsError = ref(null)
const educationError = ref(null)


// ==========================================
// MENGAMBIL DATA SISWA
// ==========================================

const fetchStudent = async () => {
  try {
    const studentId = route.params.id

    const response = await api.get(
      `/students/${studentId}`
    )

    student.value = response.data

  } catch (err) {

    console.error(
      'Error mengambil data siswa:',
      err
    )

    error.value =
      'Gagal memuat data siswa.'

  } finally {

    loading.value = false

  }
}


// ==========================================
// MENGAMBIL DATA ORANG TUA / WALI
// ==========================================

const fetchParents = async () => {

  try {

    const studentId = route.params.id

    parentsLoading.value = true
    parentsError.value = null

    const response = await api.get(
      `/students/${studentId}/parents`
    )

    parents.value = response.data

  } catch (err) {

    console.error(
      'Error mengambil data orang tua/wali:',
      err
    )

    parentsError.value =
      'Gagal memuat data orang tua/wali.'

  } finally {

    parentsLoading.value = false

  }

}


// ==========================================
// MENGAMBIL DATA PENDIDIKAN
// ==========================================

const fetchEducation = async () => {

  try {

    const studentId = route.params.id

    educationLoading.value = true
    educationError.value = null

    const response = await api.get(
      `/students/${studentId}/education`
    )

    education.value = response.data

  } catch (err) {

    console.error(
      'Error mengambil data pendidikan:',
      err
    )

    // Data pendidikan belum tersedia
    if (err.response?.status === 404) {

      education.value = null

      educationError.value = null

    } else {

      educationError.value =
        'Gagal memuat data pendidikan.'

    }

  } finally {

    educationLoading.value = false

  }

}


// ==========================================
// HAPUS ORANG TUA / WALI
// ==========================================

const deleteParent = async (parent) => {

  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus data ${parent.relation} bernama ${parent.name}?`
  )

  if (!confirmation) {
    return
  }

  try {

    await api.delete(
      `/parents/${parent.id}`
    )

    alert(
      'Data orang tua/wali berhasil dihapus.'
    )

    await fetchParents()

  } catch (err) {

    console.error(
      'Error menghapus data orang tua/wali:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data orang tua/wali.'
    )

  }

}


// ==========================================
// HALAMAN TAMBAH ORANG TUA / WALI
// ==========================================

const goToCreateParent = () => {

  const studentId = route.params.id

  router.push(
    `/students/${studentId}/parents/create`
  )

}


// ==========================================
// HALAMAN EDIT ORANG TUA / WALI
// ==========================================

const goToEditParent = (parentId) => {

  const studentId = route.params.id

  router.push(
    `/students/${studentId}/parents/${parentId}/edit`
  )

}


// ==========================================
// HALAMAN TAMBAH PENDIDIKAN
// ==========================================

const goToCreateEducation = () => {

  const studentId = route.params.id

  router.push(
    `/students/${studentId}/education/create`
  )

}


// ==========================================
// HALAMAN EDIT PENDIDIKAN
// ==========================================

const goToEditEducation = () => {

  if (!education.value) {
    return
  }

  const studentId = route.params.id
  const educationId = education.value.id

  router.push(
    `/students/${studentId}/education/${educationId}/edit`
  )

}


// ==========================================
// HAPUS PENDIDIKAN
// ==========================================

const deleteEducation = async () => {

  if (!education.value) {
    return
  }

  const confirmation = confirm(
    'Apakah Anda yakin ingin menghapus data pendidikan siswa ini?'
  )

  if (!confirmation) {
    return
  }

  try {

    await api.delete(
      `/education/${education.value.id}`
    )

    alert(
      'Data pendidikan berhasil dihapus.'
    )

    education.value = null

    await fetchEducation()

  } catch (err) {

    console.error(
      'Error menghapus data pendidikan:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data pendidikan.'
    )

  }

}


// ==========================================
// HALAMAN EDIT SISWA
// ==========================================

const goToEditStudent = () => {

  router.push(
    `/students/${student.value.id}/edit`
  )

}


// ==========================================
// KEMBALI KE DAFTAR SISWA
// ==========================================

const goBack = () => {

  router.push('/students')

}


// ==========================================
// LOAD DATA
// ==========================================

onMounted(async () => {

  await fetchStudent()

  await fetchParents()

  await fetchEducation()

})
</script>


<template>

  <main class="student-detail">

    <h1>
      Detail Data Siswa
    </h1>


    <!-- ================================= -->
    <!-- LOADING SISWA -->
    <!-- ================================= -->

    <div
      v-if="loading"
      class="loading"
    >
      Memuat data siswa...
    </div>


    <!-- ================================= -->
    <!-- ERROR SISWA -->
    <!-- ================================= -->

    <div
      v-else-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <!-- ================================= -->
    <!-- DATA SISWA -->
    <!-- ================================= -->

    <div
      v-else-if="student"
      class="detail-container"
    >


      <!-- ================================= -->
      <!-- IDENTITAS SISWA -->
      <!-- ================================= -->

      <section class="detail-section">

        <h2>
          Identitas Siswa
        </h2>

        <div class="detail-grid">


          <!-- NIS -->

          <div class="detail-item">

            <span class="label">
              NIS
            </span>

            <span>
              {{ student.nis }}
            </span>

          </div>


          <!-- NISN -->

          <div class="detail-item">

            <span class="label">
              NISN
            </span>

            <span>
              {{ student.nisn || '-' }}
            </span>

          </div>


          <!-- NIK -->

          <div class="detail-item">

            <span class="label">
              NIK
            </span>

            <span>
              {{ student.nik || '-' }}
            </span>

          </div>


          <!-- NAMA LENGKAP -->

          <div class="detail-item">

            <span class="label">
              Nama Lengkap
            </span>

            <span>
              {{ student.fullName }}
            </span>

          </div>


          <!-- NAMA PANGGILAN -->

          <div class="detail-item">

            <span class="label">
              Nama Panggilan
            </span>

            <span>
              {{ student.nickname || '-' }}
            </span>

          </div>


          <!-- JENIS KELAMIN -->

          <div class="detail-item">

            <span class="label">
              Jenis Kelamin
            </span>

            <span>
              {{ student.gender }}
            </span>

          </div>


          <!-- TEMPAT LAHIR -->

          <div class="detail-item">

            <span class="label">
              Tempat Lahir
            </span>

            <span>
              {{ student.birthPlace || '-' }}
            </span>

          </div>


          <!-- TANGGAL LAHIR -->

          <div class="detail-item">

            <span class="label">
              Tanggal Lahir
            </span>

            <span>

              {{
                student.birthDate
                  ? new Date(
                      student.birthDate
                    ).toLocaleDateString('id-ID')
                  : '-'
              }}

            </span>

          </div>


          <!-- AGAMA -->

          <div class="detail-item">

            <span class="label">
              Agama
            </span>

            <span>
              {{ student.religion || '-' }}
            </span>

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- KONTAK SISWA -->
      <!-- ================================= -->

      <section class="detail-section">

        <h2>
          Kontak
        </h2>

        <div class="detail-grid">


          <!-- ALAMAT -->

          <div
            class="detail-item full-width"
          >

            <span class="label">
              Alamat
            </span>

            <span>
              {{ student.address || '-' }}
            </span>

          </div>


          <!-- TELEPON -->

          <div class="detail-item">

            <span class="label">
              Nomor Telepon
            </span>

            <span>
              {{ student.phone || '-' }}
            </span>

          </div>


          <!-- EMAIL -->

          <div class="detail-item">

            <span class="label">
              Email
            </span>

            <span>
              {{ student.email || '-' }}
            </span>

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- ORANG TUA / WALI -->
      <!-- ================================= -->

      <section class="detail-section">


        <!-- HEADER -->

        <div class="section-header">

          <h2>
            Orang Tua / Wali
          </h2>

          <button
            class="btn-add-parent"
            @click="goToCreateParent"
          >
            + Tambah Orang Tua/Wali
          </button>

        </div>


        <!-- LOADING -->

        <div
          v-if="parentsLoading"
          class="loading"
        >
          Memuat data orang tua/wali...
        </div>


        <!-- ERROR -->

        <div
          v-else-if="parentsError"
          class="error-box"
        >
          {{ parentsError }}
        </div>


        <!-- BELUM ADA DATA -->

        <div
          v-else-if="parents.length === 0"
          class="empty-parent"
        >
          Belum ada data orang tua/wali.
        </div>


        <!-- DATA PARENT -->

        <div
          v-else
          class="parents-container"
        >

          <div
            v-for="parent in parents"
            :key="parent.id"
            class="parent-card"
          >


            <!-- HEADER PARENT -->

            <div class="parent-header">

              <div>

                <span class="parent-relation">
                  {{ parent.relation }}
                </span>

                <h3>
                  {{ parent.name }}
                </h3>

              </div>


              <!-- ACTION -->

              <div class="parent-actions">

                <button
                  class="btn-edit-parent"
                  @click="goToEditParent(parent.id)"
                >
                  Edit
                </button>

                <button
                  class="btn-delete-parent"
                  @click="deleteParent(parent)"
                >
                  Hapus
                </button>

              </div>

            </div>


            <!-- DATA PARENT -->

            <div class="parent-grid">


              <!-- NIK -->

              <div class="detail-item">

                <span class="label">
                  NIK
                </span>

                <span>
                  {{ parent.nik || '-' }}
                </span>

              </div>


              <!-- TEMPAT LAHIR -->

              <div class="detail-item">

                <span class="label">
                  Tempat Lahir
                </span>

                <span>
                  {{ parent.birthPlace || '-' }}
                </span>

              </div>


              <!-- TANGGAL LAHIR -->

              <div class="detail-item">

                <span class="label">
                  Tanggal Lahir
                </span>

                <span>

                  {{
                    parent.birthDate
                      ? new Date(
                          parent.birthDate
                        ).toLocaleDateString('id-ID')
                      : '-'
                  }}

                </span>

              </div>


              <!-- PENDIDIKAN -->

              <div class="detail-item">

                <span class="label">
                  Pendidikan
                </span>

                <span>
                  {{ parent.education || '-' }}
                </span>

              </div>


              <!-- PEKERJAAN -->

              <div class="detail-item">

                <span class="label">
                  Pekerjaan
                </span>

                <span>
                  {{ parent.occupation || '-' }}
                </span>

              </div>


              <!-- PENGHASILAN -->

              <div class="detail-item">

                <span class="label">
                  Penghasilan
                </span>

                <span>
                  {{ parent.income || '-' }}
                </span>

              </div>


              <!-- TELEPON -->

              <div class="detail-item">

                <span class="label">
                  Nomor Telepon
                </span>

                <span>
                  {{ parent.phone || '-' }}
                </span>

              </div>


              <!-- ALAMAT -->

              <div
                class="detail-item full-width"
              >

                <span class="label">
                  Alamat
                </span>

                <span>
                  {{ parent.address || '-' }}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- DATA PENDIDIKAN -->
      <!-- ================================= -->

      <section class="detail-section">


        <!-- HEADER PENDIDIKAN -->

        <div class="section-header">

          <h2>
            Data Pendidikan
          </h2>


          <!-- TOMBOL TAMBAH -->

          <button
            v-if="!education && !educationLoading"
            class="btn-add-education"
            @click="goToCreateEducation"
          >
            + Tambah Pendidikan
          </button>

        </div>


        <!-- LOADING -->

        <div
          v-if="educationLoading"
          class="loading"
        >
          Memuat data pendidikan...
        </div>


        <!-- ERROR -->

        <div
          v-else-if="educationError"
          class="error-box"
        >
          {{ educationError }}
        </div>


        <!-- BELUM ADA DATA -->

        <div
          v-else-if="!education"
          class="empty-parent"
        >
          Belum ada data pendidikan.
        </div>


        <!-- DATA PENDIDIKAN -->

        <div
          v-else
          class="education-container"
        >


          <!-- HEADER DATA PENDIDIKAN -->

          <div class="education-header">

            <div>

              <span class="education-title">
                Informasi Pendidikan
              </span>

            </div>


            <!-- ACTION -->

            <div class="education-actions">

              <button
                class="btn-edit-education"
                @click="goToEditEducation"
              >
                Edit
              </button>

              <button
                class="btn-delete-education"
                @click="deleteEducation"
              >
                Hapus
              </button>

            </div>

          </div>


          <!-- DATA -->

          <div class="detail-grid">


            <!-- SEKOLAH ASAL -->

            <div class="detail-item">

              <span class="label">
                Sekolah Asal
              </span>

              <span>
                {{ education.schoolOrigin || '-' }}
              </span>

            </div>


            <!-- NIS ASAL -->

            <div class="detail-item">

              <span class="label">
                NIS Asal
              </span>

              <span>
                {{ education.nisOrigin || '-' }}
              </span>

            </div>


            <!-- TAHUN MASUK -->

            <div class="detail-item">

              <span class="label">
                Tahun Masuk
              </span>

              <span>
                {{ education.yearEntry || '-' }}
              </span>

            </div>


            <!-- KELAS -->

            <div class="detail-item">

              <span class="label">
                Kelas
              </span>

              <span>
                {{ education.className || '-' }}
              </span>

            </div>


            <!-- JURUSAN -->

            <div class="detail-item">

              <span class="label">
                Jurusan
              </span>

              <span>
                {{ education.major || '-' }}
              </span>

            </div>


            <!-- STATUS -->

            <div class="detail-item">

              <span class="label">
                Status Pendidikan
              </span>

              <span>
                {{ education.status || '-' }}
              </span>

            </div>

          </div>

        </div>

      </section>


      <!-- ================================= -->
      <!-- STATUS SISWA -->
      <!-- ================================= -->

      <section class="detail-section">

        <h2>
          Status Siswa
        </h2>

        <div class="status">
          {{ student.status }}
        </div>

      </section>


      <!-- ================================= -->
      <!-- BUTTON -->
      <!-- ================================= -->

      <div class="button-group">


        <!-- KEMBALI -->

        <button
          class="btn-back"
          @click="goBack"
        >
          Kembali
        </button>


        <!-- EDIT SISWA -->

        <button
          class="btn-edit"
          @click="goToEditStudent"
        >
          Edit Data Siswa
        </button>

      </div>

    </div>

  </main>

</template>


<style scoped>

/* ================================= */
/* MAIN */
/* ================================= */

.student-detail {

  padding: 2rem;

  max-width: 900px;

  margin: 0 auto;

}


/* ================================= */
/* LOADING */
/* ================================= */

.loading {

  padding: 20px;

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
/* CONTAINER */
/* ================================= */

.detail-container {

  background: white;

}


/* ================================= */
/* SECTION */
/* ================================= */

.detail-section {

  margin-bottom: 25px;

  padding: 20px;

  border-radius: 8px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1);

}


.detail-section h2 {

  margin-top: 0;

  margin-bottom: 20px;

  border-bottom: 1px solid #ddd;

  padding-bottom: 10px;

}


/* ================================= */
/* DETAIL GRID */
/* ================================= */

.detail-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;

}


.detail-item {

  display: flex;

  flex-direction: column;

  gap: 5px;

}


.label {

  font-size: 14px;

  font-weight: bold;

  color: #666;

}


.full-width {

  grid-column: span 2;

}


/* ================================= */
/* SECTION HEADER */
/* ================================= */

.section-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;

}


.section-header h2 {

  flex: 1;

}


/* ================================= */
/* ORANG TUA / WALI */
/* ================================= */

.btn-add-parent {

  padding: 9px 14px;

  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

}


.parents-container {

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.parent-card {

  border: 1px solid #ddd;

  border-radius: 8px;

  padding: 18px;

}


.parent-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 20px;

}


.parent-header h3 {

  margin: 5px 0 0;

}


.parent-relation {

  font-size: 13px;

  font-weight: bold;

  color: #666;

  text-transform: uppercase;

}


.parent-actions {

  display: flex;

  gap: 8px;

}


.parent-actions button {

  border: none;

  border-radius: 4px;

  padding: 7px 12px;

  color: white;

  cursor: pointer;

}


.btn-edit-parent {

  background-color: #ff9800;

}


.btn-delete-parent {

  background-color: #f44336;

}


/* ================================= */
/* PARENT GRID */
/* ================================= */

.parent-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;

}


/* ================================= */
/* EMPTY DATA */
/* ================================= */

.empty-parent {

  padding: 20px;

  text-align: center;

  color: #777;

  background-color: #f5f5f5;

  border-radius: 6px;

}


/* ================================= */
/* EDUCATION */
/* ================================= */

.btn-add-education {

  padding: 9px 14px;

  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

}


.education-container {

  border: 1px solid #ddd;

  border-radius: 8px;

  padding: 18px;

}


.education-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 20px;

}


.education-title {

  font-size: 16px;

  font-weight: bold;

}


.education-actions {

  display: flex;

  gap: 8px;

}


.education-actions button {

  border: none;

  border-radius: 4px;

  padding: 7px 12px;

  color: white;

  cursor: pointer;

}


.btn-edit-education {

  background-color: #ff9800;

}


.btn-delete-education {

  background-color: #f44336;

}


/* ================================= */
/* STATUS */
/* ================================= */

.status {

  display: inline-block;

  width: fit-content;

  padding: 6px 12px;

  border-radius: 5px;

  background-color: #e8f5e9;

  color: #2e7d32;

  font-weight: bold;

}


/* ================================= */
/* BUTTON */
/* ================================= */

.button-group {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 20px;

}


.button-group button {

  padding: 10px 20px;

  border: none;

  border-radius: 5px;

  cursor: pointer;

}


.btn-back {

  background-color: #757575;

  color: white;

}


.btn-edit {

  background-color: #2196f3;

  color: white;

}


/* ================================= */
/* HOVER */
/* ================================= */

.button-group button:hover,
.parent-actions button:hover,
.education-actions button:hover,
.btn-add-parent:hover,
.btn-add-education:hover {

  opacity: 0.9;

}


/* ================================= */
/* RESPONSIVE */
/* ================================= */

@media (max-width: 600px) {

  .student-detail {

    padding: 1rem;

  }


  .detail-grid,
  .parent-grid {

    grid-template-columns: 1fr;

  }


  .full-width {

    grid-column: span 1;

  }


  .section-header {

    flex-direction: column;

    align-items: stretch;

  }


  .parent-header,
  .education-header {

    flex-direction: column;

    gap: 15px;

  }


  .parent-actions,
  .education-actions {

    width: 100%;

  }


  .parent-actions button,
  .education-actions button {

    flex: 1;

  }


  .button-group {

    flex-direction: column;

  }


  .button-group button {

    width: 100%;

  }

}

</style>