<template>
  <div class="dashboard">
    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Ringkasan data Buku Induk Siswa</p>
      </div>

      <button class="refresh-button" @click="loadDashboard">
        ↻ Refresh
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading">
      Memuat data dashboard...
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- DASHBOARD CONTENT -->
    <div v-else>

      <!-- STATISTIK SISWA -->
      <section class="dashboard-section">
        <h2>Data Siswa</h2>

        <div class="stats-grid">

          <div class="stat-card">
            <div class="stat-icon">👨‍🎓</div>
            <div>
              <span class="stat-label">Total Siswa</span>
              <strong>{{ dashboard.students.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div>
              <span class="stat-label">Siswa Aktif</span>
              <strong>{{ dashboard.students.active }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">−</div>
            <div>
              <span class="stat-label">Siswa Nonaktif</span>
              <strong>{{ dashboard.students.inactive }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👪</div>
            <div>
              <span class="stat-label">Orang Tua / Wali</span>
              <strong>{{ dashboard.parents.total }}</strong>
            </div>
          </div>

        </div>
      </section>


      <!-- AKADEMIK -->
      <section class="dashboard-section">
        <h2>Akademik</h2>

        <div class="stats-grid">

          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div>
              <span class="stat-label">Data Pendidikan</span>
              <strong>{{ dashboard.education.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div>
              <span class="stat-label">Perkembangan</span>
              <strong>{{ dashboard.developments.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div>
              <span class="stat-label">Total Nilai</span>
              <strong>{{ dashboard.grades.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div>
              <span class="stat-label">Rata-rata Nilai</span>
              <strong>{{ dashboard.grades.average }}</strong>
            </div>
          </div>

        </div>
      </section>


      <!-- NON AKADEMIK -->
      <section class="dashboard-section">
        <h2>Non-Akademik & Kedisiplinan</h2>

        <div class="stats-grid">

          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div>
              <span class="stat-label">Prestasi</span>
              <strong>{{ dashboard.achievements.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div>
              <span class="stat-label">Ekstrakurikuler</span>
              <strong>{{ dashboard.extracurriculars.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⚠</div>
            <div>
              <span class="stat-label">Pelanggaran</span>
              <strong>{{ dashboard.violations.total }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">!</div>
            <div>
              <span class="stat-label">Total Poin Pelanggaran</span>
              <strong>{{ dashboard.violations.points }}</strong>
            </div>
          </div>

        </div>
      </section>


      <!-- GRAFIK -->
      <section class="dashboard-section">
        <h2>Statistik Siswa</h2>

        <div class="chart-grid">

          <!-- GENDER -->
          <div class="dashboard-card">
            <h3>Jenis Kelamin</h3>

            <div class="gender-chart">

              <div
                class="gender-circle"
                :style="{ background: genderGradient }"
              >
                <div class="circle-center">
                  <strong>{{ dashboard.students.total }}</strong>
                  <span>Siswa</span>
                </div>
              </div>

              <div class="legend">

                <div class="legend-item">
                  <span class="legend-dot male"></span>
                  <div>
                    <strong>Laki-laki</strong>
                    <span>
                      {{ dashboard.students.gender.male }}
                      siswa
                    </span>
                  </div>
                </div>

                <div class="legend-item">
                  <span class="legend-dot female"></span>
                  <div>
                    <strong>Perempuan</strong>
                    <span>
                      {{ dashboard.students.gender.female }}
                      siswa
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>


          <!-- STATUS -->
          <div class="dashboard-card">
            <h3>Status Siswa</h3>

            <div class="status-chart">

              <div class="bar-item">
                <div class="bar-header">
                  <span>Aktif</span>
                  <strong>{{ dashboard.students.active }}</strong>
                </div>

                <div class="bar-background">
                  <div
                    class="bar active-bar"
                    :style="{ width: activePercentage + '%' }"
                  ></div>
                </div>
              </div>


              <div class="bar-item">
                <div class="bar-header">
                  <span>Nonaktif</span>
                  <strong>{{ dashboard.students.inactive }}</strong>
                </div>

                <div class="bar-background">
                  <div
                    class="bar inactive-bar"
                    :style="{ width: inactivePercentage + '%' }"
                  ></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      <!-- DATA TERBARU -->
      <section class="dashboard-section">
        <h2>Data Terbaru</h2>

        <div class="recent-grid">

          <!-- SISWA TERBARU -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Siswa Terbaru</h3>
              <RouterLink to="/students">
                Lihat semua
              </RouterLink>
            </div>

            <div
              v-if="dashboard.recentStudents.length === 0"
              class="empty-state"
            >
              Belum ada data siswa.
            </div>

            <div
              v-for="student in dashboard.recentStudents"
              :key="student.id"
              class="recent-item"
            >
              <div class="recent-avatar">
                {{ getInitial(student.fullName) }}
              </div>

              <div class="recent-info">
                <strong>{{ student.fullName }}</strong>
                <span>
                  NIS: {{ student.nis }}
                </span>
              </div>

              <span
                class="status-badge"
                :class="{
                  inactive: student.status !== 'ACTIVE'
                }"
              >
                {{
                  student.status === 'ACTIVE'
                    ? 'Aktif'
                    : 'Nonaktif'
                }}
              </span>
            </div>
          </div>


          <!-- PRESTASI TERBARU -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Prestasi Terbaru</h3>
            </div>

            <div
              v-if="dashboard.recentAchievements.length === 0"
              class="empty-state"
            >
              Belum ada data prestasi.
            </div>

            <div
              v-for="achievement in dashboard.recentAchievements"
              :key="achievement.id"
              class="recent-item"
            >
              <div class="recent-icon achievement-icon">
                🏆
              </div>

              <div class="recent-info">
                <strong>{{ achievement.title }}</strong>
                <span>
                  {{ achievement.student?.fullName || '-' }}
                </span>
              </div>

              <span class="level-badge">
                {{ achievement.level || '-' }}
              </span>
            </div>
          </div>


          <!-- PELANGGARAN TERBARU -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3>Pelanggaran Terbaru</h3>
            </div>

            <div
              v-if="dashboard.recentViolations.length === 0"
              class="empty-state"
            >
              Belum ada data pelanggaran.
            </div>

            <div
              v-for="violation in dashboard.recentViolations"
              :key="violation.id"
              class="recent-item"
            >
              <div class="recent-icon violation-icon">
                ⚠
              </div>

              <div class="recent-info">
                <strong>
                  {{ violation.violationType }}
                </strong>

                <span>
                  {{ violation.student?.fullName || '-' }}
                </span>
              </div>

              <span class="points-badge">
                {{ violation.points || 0 }} poin
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const loading = ref(true)
const error = ref('')

const dashboard = ref({
  students: {
    total: 0,
    active: 0,
    inactive: 0,
    gender: {
      male: 0,
      female: 0
    }
  },

  parents: {
    total: 0
  },

  education: {
    total: 0
  },

  developments: {
    total: 0
  },

  grades: {
    total: 0,
    average: 0
  },

  achievements: {
    total: 0
  },

  extracurriculars: {
    total: 0
  },

  violations: {
    total: 0,
    points: 0
  },

  recentStudents: [],
  recentAchievements: [],
  recentViolations: []
})


const loadDashboard = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await api.get('/dashboard')

    dashboard.value = response.data
  } catch (err) {
    console.error(err)

    error.value =
      err.response?.data?.message ||
      'Gagal mengambil data dashboard.'
  } finally {
    loading.value = false
  }
}


const activePercentage = computed(() => {
  const total = dashboard.value.students.total

  if (!total) return 0

  return Math.round(
    (dashboard.value.students.active / total) * 100
  )
})


const inactivePercentage = computed(() => {
  const total = dashboard.value.students.total

  if (!total) return 0

  return Math.round(
    (dashboard.value.students.inactive / total) * 100
  )
})


const genderGradient = computed(() => {
  const male = dashboard.value.students.gender.male
  const female = dashboard.value.students.gender.female
  const total = male + female

  if (!total) {
    return 'conic-gradient(#e5e7eb 0deg 360deg)'
  }

  const maleDegree = (male / total) * 360

  return `
    conic-gradient(
      #3b82f6 0deg ${maleDegree}deg,
      #ec4899 ${maleDegree}deg 360deg
    )
  `
})


const getInitial = (name) => {
  if (!name) return '?'

  return name
    .trim()
    .charAt(0)
    .toUpperCase()
}


onMounted(() => {
  loadDashboard()
})
</script>


<style scoped>
.dashboard {
  padding: 25px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  margin: 0 0 5px;
  font-size: 28px;
  color: #222;
}

.dashboard-header p {
  margin: 0;
  color: #777;
}

.refresh-button {
  border: none;
  border-radius: 7px;
  padding: 10px 16px;
  background-color: #222;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.refresh-button:hover {
  opacity: 0.9;
}


/* SECTION */

.dashboard-section {
  margin-bottom: 30px;
}

.dashboard-section h2 {
  margin: 0 0 15px;
  font-size: 20px;
  color: #222;
}


/* STAT CARD */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f1f3f5;
  font-size: 22px;
}

.stat-card strong {
  display: block;
  margin-top: 5px;
  font-size: 24px;
  color: #222;
}

.stat-label {
  color: #777;
  font-size: 13px;
}


/* CARD */

.dashboard-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.dashboard-card h3 {
  margin: 0 0 20px;
  font-size: 17px;
  color: #222;
}


/* CHART */

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.gender-chart {
  display: flex;
  align-items: center;
  gap: 35px;
}

.gender-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-center {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-center strong {
  font-size: 22px;
}

.circle-center span {
  font-size: 12px;
  color: #777;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-item div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.legend-item span:last-child {
  font-size: 13px;
  color: #777;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.male {
  background-color: #3b82f6;
}

.female {
  background-color: #ec4899;
}


/* STATUS */

.status-chart {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-top: 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.bar-background {
  width: 100%;
  height: 12px;
  border-radius: 20px;
  background-color: #eee;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 20px;
  transition: width 0.4s ease;
}

.active-bar {
  background-color: #22c55e;
}

.inactive-bar {
  background-color: #ef4444;
}


/* RECENT */

.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
}

.card-header a {
  color: #333;
  font-size: 13px;
  text-decoration: none;
}

.card-header a:hover {
  text-decoration: underline;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-avatar {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f1f3f5;
  font-weight: bold;
}

.recent-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f1f3f5;
}

.recent-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-info strong {
  font-size: 14px;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-info span {
  font-size: 12px;
  color: #777;
}

.status-badge,
.level-badge,
.points-badge {
  flex-shrink: 0;
  padding: 5px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: bold;
}

.status-badge {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #c62828;
}

.level-badge {
  background-color: #f1f3f5;
  color: #555;
}

.points-badge {
  background-color: #fff3e0;
  color: #e65100;
}

.empty-state {
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  text-align: center;
}


/* LOADING & ERROR */

.loading {
  padding: 50px;
  text-align: center;
  color: #777;
}

.error-message {
  padding: 15px;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  background-color: #ffebee;
  color: #c62828;
}


/* RESPONSIVE */

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recent-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dashboard {
    padding: 15px;
  }

  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .gender-chart {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>