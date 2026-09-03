<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const studentId = route.params.id


// =========================================================
// STATE
// =========================================================

const student = ref(null)
const parents = ref([])
const education = ref(null)
const developments = ref([])
const grades = ref([])
const achievements = ref([])
const extracurriculars = ref([])
const violations = ref([])

const loading = ref(true)
const parentsLoading = ref(false)
const educationLoading = ref(false)
const developmentsLoading = ref(false)
const gradesLoading = ref(false)
const achievementsLoading = ref(false)
const extracurricularsLoading = ref(false)
const violationsLoading = ref(false)

const error = ref(null)
const parentsError = ref(null)
const educationError = ref(null)
const developmentsError = ref(null)
const gradesError = ref(null)
const achievementsError = ref(null)
const extracurricularsError = ref(null)
const violationsError = ref(null)


// =========================================================
// STUDENT
// =========================================================

const fetchStudent = async () => {
  try {
    const response = await api.get(
      `/students/${studentId}`
    )

    student.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data siswa:',
      err
    )

    error.value = 'Gagal memuat data siswa.'
  } finally {
    loading.value = false
  }
}

const goToEditStudent = () => {
  if (!student.value) return

  router.push(
    `/students/${student.value.id}/edit`
  )
}


// =========================================================
// PARENT / WALI
// =========================================================

const fetchParents = async () => {
  try {
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

const goToCreateParent = () => {
  router.push(
    `/students/${studentId}/parents/create`
  )
}

const goToEditParent = (parentId) => {
  router.push(
    `/students/${studentId}/parents/${parentId}/edit`
  )
}

const deleteParent = async (parent) => {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus data ${parent.relation} bernama ${parent.name}?`
  )

  if (!confirmation) return

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


// =========================================================
// EDUCATION
// =========================================================

const fetchEducation = async () => {
  try {
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

const goToCreateEducation = () => {
  router.push(
    `/students/${studentId}/education/create`
  )
}

const goToEditEducation = () => {
  if (!education.value) return

  router.push(
    `/students/${studentId}/education/${education.value.id}/edit`
  )
}

const deleteEducation = async () => {
  if (!education.value) return

  const confirmation = confirm(
    'Apakah Anda yakin ingin menghapus data pendidikan siswa ini?'
  )

  if (!confirmation) return

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


// =========================================================
// DEVELOPMENT
// =========================================================

const fetchDevelopments = async () => {
  try {
    developmentsLoading.value = true
    developmentsError.value = null

    const response = await api.get(
      `/students/${studentId}/developments`
    )

    developments.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data perkembangan siswa:',
      err
    )

    developmentsError.value =
      'Gagal memuat data perkembangan siswa.'
  } finally {
    developmentsLoading.value = false
  }
}

const goToCreateDevelopment = () => {
  router.push(
    `/students/${studentId}/developments/create`
  )
}

const goToEditDevelopment = (developmentId) => {
  router.push(
    `/students/${studentId}/developments/${developmentId}/edit`
  )
}

const deleteDevelopment = async (development) => {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus data perkembangan siswa tahun ajaran ${development.academicYear} semester ${development.semester}?`
  )

  if (!confirmation) return

  try {
    await api.delete(
      `/developments/${development.id}`
    )

    alert(
      'Data perkembangan siswa berhasil dihapus.'
    )

    await fetchDevelopments()
  } catch (err) {
    console.error(
      'Error menghapus data perkembangan siswa:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data perkembangan siswa.'
    )
  }
}


// =========================================================
// GRADES / RAPOR
// =========================================================

const fetchGrades = async () => {
  try {
    gradesLoading.value = true
    gradesError.value = null

    const response = await api.get(
      `/students/${studentId}/grades`
    )

    grades.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data nilai/rapor:',
      err
    )

    gradesError.value =
      'Gagal memuat data nilai/rapor.'
  } finally {
    gradesLoading.value = false
  }
}

const goToCreateGrade = () => {
  router.push(
    `/students/${studentId}/grades/create`
  )
}

const goToEditGrade = (gradeId) => {
  router.push(
    `/students/${studentId}/grades/${gradeId}/edit`
  )
}

const deleteGrade = async (grade) => {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus nilai ${grade.subject} tahun ajaran ${grade.academicYear} semester ${grade.semester}?`
  )

  if (!confirmation) return

  try {
    await api.delete(
      `/grades/${grade.id}`
    )

    alert(
      'Data nilai berhasil dihapus.'
    )

    await fetchGrades()
  } catch (err) {
    console.error(
      'Error menghapus data nilai:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data nilai.'
    )
  }
}


// =========================================================
// ACHIEVEMENT / PRESTASI
// =========================================================

const fetchAchievements = async () => {
  try {
    achievementsLoading.value = true
    achievementsError.value = null

    const response = await api.get(
      `/students/${studentId}/achievements`
    )

    achievements.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data prestasi:',
      err
    )

    achievementsError.value =
      'Gagal memuat data prestasi.'
  } finally {
    achievementsLoading.value = false
  }
}

const goToCreateAchievement = () => {
  router.push(
    `/students/${studentId}/achievements/create`
  )
}

const goToEditAchievement = (achievementId) => {
  router.push(
    `/students/${studentId}/achievements/${achievementId}/edit`
  )
}

const deleteAchievement = async (achievement) => {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus prestasi "${achievement.title}"?`
  )

  if (!confirmation) return

  try {
    await api.delete(
      `/achievements/${achievement.id}`
    )

    alert(
      'Data prestasi berhasil dihapus.'
    )

    await fetchAchievements()
  } catch (err) {
    console.error(
      'Error menghapus data prestasi:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data prestasi.'
    )
  }
}


// =========================================================
// EXTRACURRICULAR
// =========================================================

const fetchExtracurriculars = async () => {
  try {
    extracurricularsLoading.value = true
    extracurricularsError.value = null

    const response = await api.get(
      `/students/${studentId}/extracurriculars`
    )

    extracurriculars.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data ekstrakurikuler:',
      err
    )

    extracurricularsError.value =
      'Gagal memuat data ekstrakurikuler.'
  } finally {
    extracurricularsLoading.value = false
  }
}

const goToCreateExtracurricular = () => {
  router.push(
    `/students/${studentId}/extracurriculars/create`
  )
}

const goToEditExtracurricular = (
  extracurricularId
) => {
  router.push(
    `/students/${studentId}/extracurriculars/${extracurricularId}/edit`
  )
}

const deleteExtracurricular = async (
  extracurricular
) => {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus ekstrakurikuler "${extracurricular.activityName}"?`
  )

  if (!confirmation) return

  try {
    await api.delete(
      `/extracurriculars/${extracurricular.id}`
    )

    alert(
      'Data ekstrakurikuler berhasil dihapus.'
    )

    await fetchExtracurriculars()
  } catch (err) {
    console.error(
      'Error menghapus data ekstrakurikuler:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data ekstrakurikuler.'
    )
  }
}


// =========================================================
// VIOLATION / PELANGGARAN
// =========================================================

const fetchViolations = async () => {
  try {
    violationsLoading.value = true
    violationsError.value = null

    const response = await api.get(
      `/students/${studentId}/violations`
    )

    violations.value = response.data
  } catch (err) {
    console.error(
      'Error mengambil data pelanggaran:',
      err
    )

    violationsError.value =
      err.response?.data?.message ||
      'Gagal memuat data pelanggaran.'
  } finally {
    violationsLoading.value = false
  }
}

const formatViolationDate = (date) => {
  if (!date) return '-'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  )
}

const goToCreateViolation = () => {
  router.push(
    `/students/${studentId}/violations/create`
  )
}

const goToEditViolation = (violationId) => {
  router.push(
    `/students/${studentId}/violations/${violationId}/edit`
  )
}

const deleteViolation = async (violationId) => {
  const confirmation = confirm(
    'Apakah Anda yakin ingin menghapus data pelanggaran ini?'
  )

  if (!confirmation) return

  try {
    await api.delete(
      `/violations/${violationId}`
    )

    alert(
      'Data pelanggaran berhasil dihapus.'
    )

    await fetchViolations()
  } catch (err) {
    console.error(
      'Error menghapus data pelanggaran:',
      err
    )

    alert(
      err.response?.data?.message ||
      'Gagal menghapus data pelanggaran.'
    )
  }
}


// =========================================================
// NAVIGATION
// =========================================================

const goBack = () => {
  router.push('/students')
}


// =========================================================
// LOAD DATA
// =========================================================

onMounted(async () => {
  await fetchStudent()
  await fetchParents()
  await fetchEducation()
  await fetchDevelopments()
  await fetchGrades()
  await fetchAchievements()
  await fetchExtracurriculars()
  await fetchViolations()
})
</script>


<template>
  <main class="student-detail">

    <h1>Detail Data Siswa</h1>

    <!-- =====================================================
         LOADING SISWA
         ===================================================== -->

    <div
      v-if="loading"
      class="loading"
    >
      Memuat data siswa...
    </div>


    <!-- =====================================================
         ERROR SISWA
         ===================================================== -->

    <div
      v-else-if="error"
      class="error-box"
    >
      {{ error }}
    </div>


    <!-- =====================================================
         DATA SISWA
         ===================================================== -->

    <div
      v-else-if="student"
      class="detail-container"
    >

      <!-- ===================================================
           IDENTITAS SISWA
           =================================================== -->

      <section class="detail-section">

        <h2>Identitas Siswa</h2>

        <div class="detail-grid">

          <div class="detail-item">
            <span class="label">NIS</span>
            <span>{{ student.nis }}</span>
          </div>

          <div class="detail-item">
            <span class="label">NISN</span>
            <span>{{ student.nisn || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">NIK</span>
            <span>{{ student.nik || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Nama Lengkap</span>
            <span>{{ student.fullName }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Nama Panggilan</span>
            <span>{{ student.nickname || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Jenis Kelamin</span>
            <span>{{ student.gender }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Tempat Lahir</span>
            <span>{{ student.birthPlace || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Tanggal Lahir</span>
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

          <div class="detail-item">
            <span class="label">Agama</span>
            <span>{{ student.religion || '-' }}</span>
          </div>

        </div>

      </section>


      <!-- ===================================================
           KONTAK
           =================================================== -->

      <section class="detail-section">

        <h2>Kontak</h2>

        <div class="detail-grid">

          <div class="detail-item full-width">
            <span class="label">Alamat</span>
            <span>{{ student.address || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Nomor Telepon</span>
            <span>{{ student.phone || '-' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Email</span>
            <span>{{ student.email || '-' }}</span>
          </div>

        </div>

      </section>


      <!-- ===================================================
           ORANG TUA / WALI
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <h2>Orang Tua / Wali</h2>

          <button
            class="btn-add-parent"
            @click="goToCreateParent"
          >
            + Tambah Orang Tua/Wali
          </button>

        </div>

        <div
          v-if="parentsLoading"
          class="loading"
        >
          Memuat data orang tua/wali...
        </div>

        <div
          v-else-if="parentsError"
          class="error-box"
        >
          {{ parentsError }}
        </div>

        <div
          v-else-if="parents.length === 0"
          class="empty-data"
        >
          Belum ada data orang tua/wali.
        </div>

        <div
          v-else
          class="parents-container"
        >

          <div
            v-for="parent in parents"
            :key="parent.id"
            class="parent-card"
          >

            <div class="parent-header">

              <div>
                <span class="parent-relation">
                  {{ parent.relation }}
                </span>

                <h3>
                  {{ parent.name }}
                </h3>
              </div>

              <div class="parent-actions">

                <button
                  class="btn-edit-parent"
                  @click="
                    goToEditParent(parent.id)
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-parent"
                  @click="
                    deleteParent(parent)
                  "
                >
                  Hapus
                </button>

              </div>

            </div>

            <div class="parent-grid">

              <div class="detail-item">
                <span class="label">NIK</span>
                <span>{{ parent.nik || '-' }}</span>
              </div>

              <div class="detail-item">
                <span class="label">Tempat Lahir</span>
                <span>
                  {{ parent.birthPlace || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Tanggal Lahir</span>
                <span>
                  {{
                    parent.birthDate
                      ? new Date(
                          parent.birthDate
                        ).toLocaleDateString(
                          'id-ID'
                        )
                      : '-'
                  }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Pendidikan</span>
                <span>
                  {{ parent.education || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Pekerjaan</span>
                <span>
                  {{ parent.occupation || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Penghasilan</span>
                <span>
                  {{ parent.income || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">Nomor Telepon</span>
                <span>
                  {{ parent.phone || '-' }}
                </span>
              </div>

              <div class="detail-item full-width">
                <span class="label">Alamat</span>
                <span>
                  {{ parent.address || '-' }}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           PENDIDIKAN
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <h2>Data Pendidikan</h2>

          <button
            v-if="!education && !educationLoading"
            class="btn-add-education"
            @click="goToCreateEducation"
          >
            + Tambah Pendidikan
          </button>

        </div>

        <div
          v-if="educationLoading"
          class="loading"
        >
          Memuat data pendidikan...
        </div>

        <div
          v-else-if="educationError"
          class="error-box"
        >
          {{ educationError }}
        </div>

        <div
          v-else-if="!education"
          class="empty-data"
        >
          Belum ada data pendidikan.
        </div>

        <div
          v-else
          class="education-container"
        >

          <div class="education-header">

            <div>
              <span class="education-title">
                Informasi Pendidikan
              </span>
            </div>

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

          <div class="detail-grid">

            <div class="detail-item">
              <span class="label">Sekolah Asal</span>
              <span>
                {{ education.schoolOrigin || '-' }}
              </span>
            </div>

            <div class="detail-item">
              <span class="label">NIS Asal</span>
              <span>
                {{ education.nisOrigin || '-' }}
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Tahun Masuk</span>
              <span>
                {{ education.yearEntry || '-' }}
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Kelas</span>
              <span>
                {{ education.className || '-' }}
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Jurusan</span>
              <span>
                {{ education.major || '-' }}
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Status Pendidikan</span>
              <span>
                {{ education.status || '-' }}
              </span>
            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           PERKEMBANGAN SISWA
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <h2>Data Perkembangan Siswa</h2>

          <button
            class="btn-add-development"
            @click="goToCreateDevelopment"
          >
            + Tambah Perkembangan
          </button>

        </div>

        <div
          v-if="developmentsLoading"
          class="loading"
        >
          Memuat data perkembangan siswa...
        </div>

        <div
          v-else-if="developmentsError"
          class="error-box"
        >
          {{ developmentsError }}
        </div>

        <div
          v-else-if="developments.length === 0"
          class="empty-data"
        >
          Belum ada data perkembangan siswa.
        </div>

        <div
          v-else
          class="development-container"
        >

          <div
            v-for="development in developments"
            :key="development.id"
            class="development-card"
          >

            <div class="development-header">

              <div>

                <span class="development-year">
                  Tahun Ajaran
                </span>

                <h3>
                  {{ development.academicYear }}
                </h3>

                <span class="development-semester">
                  Semester {{ development.semester }}
                </span>

              </div>

              <div class="development-actions">

                <button
                  class="btn-edit-development"
                  @click="
                    goToEditDevelopment(
                      development.id
                    )
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-development"
                  @click="
                    deleteDevelopment(
                      development
                    )
                  "
                >
                  Hapus
                </button>

              </div>

            </div>

            <div class="development-subtitle">
              Pertumbuhan Fisik
            </div>

            <div class="detail-grid">

              <div class="detail-item">
                <span class="label">
                  Tinggi Badan
                </span>

                <span>
                  {{
                    development.height != null
                      ? development.height + ' cm'
                      : '-'
                  }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Berat Badan
                </span>

                <span>
                  {{
                    development.weight != null
                      ? development.weight + ' kg'
                      : '-'
                  }}
                </span>
              </div>

            </div>

            <div class="development-subtitle">
              Perkembangan Siswa
            </div>

            <div class="detail-grid">

              <div class="detail-item">
                <span class="label">
                  Akademik
                </span>

                <span>
                  {{ development.academic || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Sikap
                </span>

                <span>
                  {{ development.attitude || '-' }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Sosial
                </span>

                <span>
                  {{ development.social || '-' }}
                </span>
              </div>

              <div class="detail-item full-width">
                <span class="label">
                  Catatan
                </span>

                <span>
                  {{ development.notes || '-' }}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           NILAI / RAPOR
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <h2>Data Nilai / Rapor</h2>

          <button
            class="btn-add-grade"
            @click="goToCreateGrade"
          >
            + Tambah Nilai
          </button>

        </div>

        <div
          v-if="gradesLoading"
          class="loading"
        >
          Memuat data nilai/rapor...
        </div>

        <div
          v-else-if="gradesError"
          class="error-box"
        >
          {{ gradesError }}
        </div>

        <div
          v-else-if="grades.length === 0"
          class="empty-data"
        >
          Belum ada data nilai/rapor.
        </div>

        <div
          v-else
          class="grade-container"
        >

          <div
            v-for="grade in grades"
            :key="grade.id"
            class="grade-card"
          >

            <div class="grade-header">

              <div>

                <span class="grade-year">
                  Tahun Ajaran
                </span>

                <h3>
                  {{ grade.academicYear }}
                </h3>

                <span class="grade-semester">
                  Semester {{ grade.semester }}
                </span>

              </div>

              <div class="grade-actions">

                <button
                  class="btn-edit-grade"
                  @click="
                    goToEditGrade(grade.id)
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-grade"
                  @click="
                    deleteGrade(grade)
                  "
                >
                  Hapus
                </button>

              </div>

            </div>

            <div class="grade-subject">

              <span class="label">
                Mata Pelajaran
              </span>

              <strong>
                {{ grade.subject }}
              </strong>

            </div>

            <div class="detail-grid">

              <div class="detail-item">
                <span class="label">
                  Nilai Pengetahuan
                </span>

                <span>
                  {{
                    grade.knowledge != null
                      ? grade.knowledge
                      : '-'
                  }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Nilai Keterampilan
                </span>

                <span>
                  {{
                    grade.skill != null
                      ? grade.skill
                      : '-'
                  }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Nilai Akhir
                </span>

                <span>
                  {{
                    grade.finalScore != null
                      ? grade.finalScore
                      : '-'
                  }}
                </span>
              </div>

              <div class="detail-item">
                <span class="label">
                  Predikat
                </span>

                <span>
                  {{ grade.predicate || '-' }}
                </span>
              </div>

              <div class="detail-item full-width">
                <span class="label">
                  Deskripsi
                </span>

                <span>
                  {{ grade.description || '-' }}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           PRESTASI
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <h2>Prestasi</h2>

          <button
            class="btn-add-achievement"
            @click="goToCreateAchievement"
          >
            + Tambah Prestasi
          </button>

        </div>

        <div
          v-if="achievementsLoading"
          class="loading"
        >
          Memuat data prestasi...
        </div>

        <div
          v-else-if="achievementsError"
          class="error-box"
        >
          {{ achievementsError }}
        </div>

        <div
          v-else-if="achievements.length === 0"
          class="empty-data"
        >
          Belum ada data prestasi.
        </div>

        <div
          v-else
          class="achievement-container"
        >

          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
          >

            <div class="achievement-header">

              <div>

                <div class="achievement-type">
                  {{ achievement.achievementType }}
                </div>

                <h3>
                  {{ achievement.title }}
                </h3>

                <div
                  v-if="achievement.academicYear"
                  class="achievement-year"
                >
                  Tahun Ajaran:
                  {{ achievement.academicYear }}
                </div>

              </div>

              <div class="achievement-actions">

                <button
                  class="btn-edit-achievement"
                  @click="
                    goToEditAchievement(
                      achievement.id
                    )
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-achievement"
                  @click="
                    deleteAchievement(
                      achievement
                    )
                  "
                >
                  Hapus
                </button>

              </div>

            </div>

            <div class="achievement-grid">

              <div v-if="achievement.level">
                <strong>Tingkat</strong>
                <span>
                  {{ achievement.level }}
                </span>
              </div>

              <div v-if="achievement.rank">
                <strong>Peringkat</strong>
                <span>
                  {{ achievement.rank }}
                </span>
              </div>

              <div v-if="achievement.organizer">
                <strong>Penyelenggara</strong>
                <span>
                  {{ achievement.organizer }}
                </span>
              </div>

              <div v-if="achievement.date">
                <strong>Tanggal</strong>
                <span>
                  {{
                    new Date(
                      achievement.date
                    ).toLocaleDateString(
                      'id-ID',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      }
                    )
                  }}
                </span>
              </div>

            </div>

            <div
              v-if="achievement.description"
              class="achievement-description"
            >
              <strong>Keterangan</strong>

              <p>
                {{ achievement.description }}
              </p>
            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           EKSTRAKURIKULER
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <div>
            <h2>Ekstrakurikuler</h2>

            <p class="section-description">
              Kegiatan ekstrakurikuler yang diikuti siswa.
            </p>
          </div>

          <button
            class="btn-add-extracurricular"
            @click="goToCreateExtracurricular"
          >
            + Tambah Ekstrakurikuler
          </button>

        </div>

        <div
          v-if="extracurricularsLoading"
          class="loading"
        >
          Memuat data ekstrakurikuler...
        </div>

        <div
          v-else-if="extracurricularsError"
          class="error-box"
        >
          {{ extracurricularsError }}
        </div>

        <div
          v-else-if="extracurriculars.length === 0"
          class="empty-data"
        >
          Belum ada data ekstrakurikuler.
        </div>

        <div
          v-else
          class="extracurricular-container"
        >

          <div
            v-for="
              extracurricular in extracurriculars
            "
            :key="extracurricular.id"
            class="extracurricular-card"
          >

            <div class="extracurricular-header">

              <div>

                <h3>
                  {{ extracurricular.activityName }}
                </h3>

                <span
                  class="extracurricular-status"
                  :class="{
                    inactive:
                      extracurricular.status ===
                      'INACTIVE'
                  }"
                >
                  {{
                    extracurricular.status ===
                    'ACTIVE'
                      ? 'Aktif'
                      : 'Tidak Aktif'
                  }}
                </span>

              </div>

              <div class="extracurricular-actions">

                <button
                  class="btn-edit-extracurricular"
                  @click="
                    goToEditExtracurricular(
                      extracurricular.id
                    )
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-extracurricular"
                  @click="
                    deleteExtracurricular(
                      extracurricular
                    )
                  "
                >
                  Hapus
                </button>

              </div>

            </div>

            <div class="extracurricular-grid">

              <div>
                <span class="detail-label">
                  Peran / Jabatan
                </span>

                <span class="detail-value">
                  {{ extracurricular.role || '-' }}
                </span>
              </div>

              <div>
                <span class="detail-label">
                  Tingkat
                </span>

                <span class="detail-value">
                  {{ extracurricular.level || '-' }}
                </span>
              </div>

              <div>
                <span class="detail-label">
                  Tahun Ajaran
                </span>

                <span class="detail-value">
                  {{
                    extracurricular.academicYear ||
                    '-'
                  }}
                </span>
              </div>

              <div
                v-if="extracurricular.description"
                class="extracurricular-description"
              >
                <span class="detail-label">
                  Keterangan
                </span>

                <span class="detail-value">
                  {{ extracurricular.description }}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           PELANGGARAN
           =================================================== -->

      <section class="detail-section">

        <div class="section-header">

          <div>
            <h2>Pelanggaran</h2>

            <p class="section-description">
              Riwayat pelanggaran siswa.
            </p>
          </div>

          <button
            class="btn-add-violation"
            @click="goToCreateViolation"
          >
            + Tambah Pelanggaran
          </button>

        </div>

        <div
          v-if="violationsLoading"
          class="loading"
        >
          Memuat data pelanggaran...
        </div>

        <div
          v-else-if="violationsError"
          class="error-box"
        >
          {{ violationsError }}
        </div>

        <div
          v-else-if="violations.length === 0"
          class="empty-data"
        >
          Belum ada data pelanggaran.
        </div>

        <div
          v-else
          class="violations-container"
        >

          <div
            v-for="violation in violations"
            :key="violation.id"
            class="violation-card"
          >

            <div class="violation-header">

              <div>

                <span class="violation-date">
                  {{
                    formatViolationDate(
                      violation.violationDate
                    )
                  }}
                </span>

                <h3>
                  {{ violation.violationType }}
                </h3>

              </div>

              <div class="violation-actions">

                <button
                  class="btn-edit-violation"
                  @click="
                    goToEditViolation(
                      violation.id
                    )
                  "
                >
                  Edit
                </button>

                <button
                  class="btn-delete-violation"
                  @click="
                    deleteViolation(
                      violation.id
                    )
                  "
                >
                  Hapus
                </button>

              </div>

            </div>


            <div class="violation-grid">

              <div>
                <span class="detail-label">
                  Tingkat
                </span>

                <span class="detail-value">
                  {{ violation.level || '-' }}
                </span>
              </div>

              <div>
                <span class="detail-label">
                  Poin
                </span>

                <span class="detail-value">
                  {{ violation.points ?? '-' }}
                </span>
              </div>

              <div>
                <span class="detail-label">
                  Sanksi
                </span>

                <span class="detail-value">
                  {{ violation.sanction || '-' }}
                </span>
              </div>

              <div>
                <span class="detail-label">
                  Status
                </span>

                <span
                  class="violation-status"
                  :class="{
                    completed:
                      violation.status ===
                      'COMPLETED'
                  }"
                >
                  {{
                    violation.status ===
                    'COMPLETED'
                      ? 'Selesai'
                      : 'Aktif'
                  }}
                </span>
              </div>

            </div>


            <div
              v-if="violation.description"
              class="violation-description"
            >

              <span class="detail-label">
                Keterangan
              </span>

              <p>
                {{ violation.description }}
              </p>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           STATUS SISWA
           =================================================== -->

      <section class="detail-section">

        <h2>Status Siswa</h2>

        <div class="status">
          {{ student.status }}
        </div>

      </section>


      <!-- ===================================================
           BUTTON
           =================================================== -->

      <div class="button-group">

        <button
          class="btn-back"
          @click="goBack"
        >
          Kembali
        </button>

        <button
          class="btn-edit-student"
          @click="goToEditStudent"
        >
          Edit Data Siswa
        </button>

      </div>

    </div>

  </main>
</template>


<style scoped>

/* =========================================================
   MAIN
   ========================================================= */

.student-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.detail-container {
  background-color: white;
}


/* =========================================================
   LOADING & ERROR
   ========================================================= */

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-box {
  padding: 15px;
  border-radius: 6px;
  background-color: #ffebee;
  color: #c62828;
}


/* =========================================================
   SECTION
   ========================================================= */

.detail-section {
  margin-bottom: 25px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}


/* =========================================================
   SECTION HEADER
   ========================================================= */

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.section-header h2 {
  flex: 1;
}

.section-description {
  margin: -10px 0 15px;
  color: #777;
  font-size: 14px;
}


/* =========================================================
   DETAIL GRID
   ========================================================= */

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label,
.detail-label {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

.detail-value {
  font-size: 14px;
  color: #222;
}

.full-width {
  grid-column: span 2;
}


/* =========================================================
   ADD BUTTON
   ========================================================= */

.btn-add-parent,
.btn-add-education,
.btn-add-development,
.btn-add-grade,
.btn-add-achievement,
.btn-add-extracurricular,
.btn-add-violation {
  padding: 9px 14px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.btn-add-parent:hover,
.btn-add-education:hover,
.btn-add-development:hover,
.btn-add-grade:hover,
.btn-add-achievement:hover,
.btn-add-extracurricular:hover,
.btn-add-violation:hover {
  opacity: 0.9;
}


/* =========================================================
   PARENT / WALI
   ========================================================= */

.parents-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.parent-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.parent-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.parent-header h3 {
  margin: 5px 0 0;
}

.parent-relation {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
}

.parent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}


/* =========================================================
   EDUCATION
   ========================================================= */

.education-container {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.education-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.education-title {
  font-size: 16px;
  font-weight: bold;
}


/* =========================================================
   DEVELOPMENT
   ========================================================= */

.development-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.development-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.development-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.development-header h3 {
  margin: 5px 0;
  font-size: 18px;
}

.development-year {
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.development-semester {
  font-size: 14px;
  color: #777;
}

.development-subtitle {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  font-size: 15px;
  font-weight: bold;
}


/* =========================================================
   GRADE / RAPOR
   ========================================================= */

.grade-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.grade-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.grade-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.grade-header h3 {
  margin: 5px 0;
  font-size: 18px;
}

.grade-year {
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.grade-semester {
  font-size: 14px;
  color: #777;
}

.grade-subject {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 20px;
}

.grade-subject strong {
  font-size: 17px;
}


/* =========================================================
   ACHIEVEMENT / PRESTASI
   ========================================================= */

.achievement-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.achievement-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.achievement-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.achievement-type {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
}

.achievement-header h3 {
  margin: 5px 0;
  font-size: 18px;
  color: #222;
}

.achievement-year {
  margin-top: 5px;
  font-size: 13px;
  color: #777;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.achievement-grid > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.achievement-grid strong {
  font-size: 13px;
  color: #666;
}

.achievement-grid span {
  font-size: 14px;
  color: #222;
}

.achievement-description {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.achievement-description strong {
  font-size: 13px;
  color: #666;
}

.achievement-description p {
  margin: 7px 0 0;
  line-height: 1.6;
  color: #333;
}


/* =========================================================
   EXTRACURRICULAR
   ========================================================= */

.extracurricular-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.extracurricular-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.extracurricular-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.extracurricular-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.extracurricular-header h3 {
  margin: 5px 0 8px;
  font-size: 18px;
  color: #222;
}

.extracurricular-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.extracurricular-grid > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.extracurricular-description {
  margin-top: 5px;
}

.extracurricular-status {
  display: inline-block;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #e8f5e9;
  color: #2e7d32;
  font-size: 13px;
  font-weight: bold;
}

.extracurricular-status.inactive {
  background-color: #ffebee;
  color: #c62828;
}


/* =========================================================
   PELANGGARAN
   ========================================================= */

.violations-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.violation-card {
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.violation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.violation-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.violation-header h3 {
  margin: 5px 0;
  font-size: 18px;
  color: #222;
}

.violation-date {
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.violation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.violation-grid > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.violation-status {
  display: inline-block;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #ffebee;
  color: #c62828;
  font-size: 13px;
  font-weight: bold;
}

.violation-status.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.violation-description {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.violation-description p {
  margin: 7px 0 0;
  line-height: 1.6;
  color: #333;
}


/* =========================================================
   ACTION BUTTONS
   ========================================================= */

.parent-actions,
.education-actions,
.development-actions,
.grade-actions,
.achievement-actions,
.extracurricular-actions,
.violation-actions {
  display: flex;
  gap: 8px;
}

.parent-actions button,
.education-actions button,
.development-actions button,
.grade-actions button,
.achievement-actions button,
.extracurricular-actions button,
.violation-actions button {
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.parent-actions button:hover,
.education-actions button:hover,
.development-actions button:hover,
.grade-actions button:hover,
.achievement-actions button:hover,
.extracurricular-actions button:hover,
.violation-actions button:hover {
  opacity: 0.9;
}


/* =========================================================
   EDIT BUTTON
   ========================================================= */

.btn-edit-parent,
.btn-edit-education,
.btn-edit-development,
.btn-edit-grade,
.btn-edit-achievement,
.btn-edit-extracurricular,
.btn-edit-violation {
  background-color: #ff9800;
}


/* =========================================================
   DELETE BUTTON
   ========================================================= */

.btn-delete-parent,
.btn-delete-education,
.btn-delete-development,
.btn-delete-grade,
.btn-delete-achievement,
.btn-delete-extracurricular,
.btn-delete-violation {
  background-color: #f44336;
}


/* =========================================================
   EMPTY DATA
   ========================================================= */

.empty-data {
  padding: 20px;
  border-radius: 6px;
  background-color: #f5f5f5;
  color: #777;
  text-align: center;
}


/* =========================================================
   STATUS SISWA
   ========================================================= */

.status {
  display: inline-block;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 5px;
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: bold;
}


/* =========================================================
   BUTTON GROUP
   ========================================================= */

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
  transition: opacity 0.2s ease;
}

.button-group button:hover {
  opacity: 0.9;
}

.btn-back {
  background-color: #757575;
  color: white;
}

.btn-edit-student {
  background-color: #2196f3;
  color: white;
}


/* =========================================================
   RESPONSIVE - TABLET
   ========================================================= */

@media (max-width: 768px) {

  .achievement-header,
  .extracurricular-header,
  .violation-header {
    flex-direction: column;
  }

  .achievement-actions,
  .extracurricular-actions,
  .violation-actions {
    width: 100%;
  }

  .achievement-actions button,
  .extracurricular-actions button,
  .violation-actions button {
    flex: 1;
  }

  .achievement-grid,
  .violation-grid {
    grid-template-columns: 1fr;
  }

}


/* =========================================================
   RESPONSIVE - MOBILE
   ========================================================= */

@media (max-width: 600px) {

  .student-detail {
    padding: 1rem;
  }

  .detail-grid,
  .parent-grid,
  .achievement-grid,
  .extracurricular-grid,
  .violation-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .section-header button {
    width: 100%;
  }

  .parent-header,
  .education-header,
  .development-header,
  .grade-header,
  .achievement-header,
  .extracurricular-header,
  .violation-header {
    flex-direction: column;
    gap: 15px;
  }

  .parent-actions,
  .education-actions,
  .development-actions,
  .grade-actions,
  .achievement-actions,
  .extracurricular-actions,
  .violation-actions {
    width: 100%;
  }

  .parent-actions button,
  .education-actions button,
  .development-actions button,
  .grade-actions button,
  .achievement-actions button,
  .extracurricular-actions button,
  .violation-actions button {
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