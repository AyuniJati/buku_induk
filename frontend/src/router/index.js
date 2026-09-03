import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'

import StudentList from '../views/students/StudentList.vue'
import StudentCreate from '../views/students/StudentCreate.vue'
import StudentEdit from '../views/students/StudentEdit.vue'
import StudentDetail from '../views/students/StudentDetail.vue'

import ParentCreate from '../views/parents/ParentCreate.vue'
import ParentEdit from '../views/parents/ParentEdit.vue'

import EducationCreate from '../views/education/EducationCreate.vue'
import EducationEdit from '../views/education/EducationEdit.vue'

import DevelopmentCreate from '../views/development/DevelopmentCreate.vue'
import DevelopmentEdit from '../views/development/DevelopmentEdit.vue'

import GradeCreate from '../views/grade/GradeCreate.vue'
import GradeEdit from '../views/grade/GradeEdit.vue'

import AchievementCreate from '../views/achievement/AchievementCreate.vue'

import ExtracurricularCreate from '../views/ekstrakurikuler/ExtracurricularCreate.vue'
import ExtracurricularEdit from '../views/ekstrakurikuler/ExtracurricularEdit.vue'

import ViolationCreate from '../views/pelanggaran/ViolationCreate.vue'
import ViolationEdit from '../views/pelanggaran/ViolationEdit.vue'

import Dashboard from '../views/Dashboard.vue'


const router = createRouter({

  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [

    // ======================================
    // LOGIN
    // ======================================

    {
      path: '/login',
      name: 'Login',
      component: Login
    },


    // ======================================
    // DASHBOARD
    // ======================================

    {
      path: '/',
      redirect: '/dashboard'
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },


    // ======================================
    // STUDENT
    // ======================================

    {
      path: '/students',
      name: 'students',
      component: StudentList
    },

    {
      path: '/students/create',
      name: 'student-create',
      component: StudentCreate
    },

    {
      path: '/students/:id',
      name: 'student-detail',
      component: StudentDetail
    },

    {
      path: '/students/:id/edit',
      name: 'student-edit',
      component: StudentEdit
    },


    // ======================================
    // PARENTS / WALI
    // ======================================

    {
      path: '/students/:id/parents/create',
      name: 'parent-create',
      component: ParentCreate
    },

    {
      path: '/students/:studentId/parents/:parentId/edit',
      name: 'parent-edit',
      component: ParentEdit
    },


    // ======================================
    // EDUCATION
    // ======================================

    {
      path: '/students/:studentId/education/create',
      name: 'education-create',
      component: EducationCreate
    },

    {
      path: '/students/:studentId/education/:educationId/edit',
      name: 'education-edit',
      component: EducationEdit
    },


    // ======================================
    // DEVELOPMENT
    // ======================================

    {
      path: '/students/:studentId/developments/create',
      name: 'DevelopmentCreate',
      component: DevelopmentCreate
    },

    {
      path: '/students/:studentId/developments/:developmentId/edit',
      name: 'DevelopmentEdit',
      component: DevelopmentEdit
    },


    // ======================================
    // GRADE / RAPOR
    // ======================================

    {
      path: '/students/:studentId/grades/create',
      name: 'GradeCreate',
      component: GradeCreate
    },

    {
      path: '/students/:studentId/grades/:gradeId/edit',
      name: 'GradeEdit',
      component: GradeEdit
    },


    // ======================================
    // ACHIEVEMENT / PRESTASI
    // ======================================

    {
      path: '/students/:studentId/achievements/create',
      name: 'AchievementCreate',
      component: AchievementCreate
    },


    // ======================================
    // EKSTRAKURIKULER
    // ======================================

    {
      path: '/students/:id/extracurriculars/create',
      name: 'ExtracurricularCreate',
      component: ExtracurricularCreate
    },

    {
      path: '/students/:id/extracurriculars/:extracurricularId/edit',
      name: 'ExtracurricularEdit',
      component: ExtracurricularEdit
    },


    // ======================================
    // PELANGGARAN
    // ======================================

    {
      path: '/students/:id/violations/create',
      name: 'ViolationCreate',
      component: ViolationCreate
    },

    {
      path: '/students/:id/violations/:violationId/edit',
      name: 'ViolationEdit',
      component: ViolationEdit
    }

  ]

})


// ======================================
// ROUTE GUARD
// ======================================

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token')


  // Jika belum login dan mencoba membuka
  // halaman selain /login
  if (to.path !== '/login' && !token) {

    next('/login')

    return
  }


  // Jika sudah login tetapi mencoba
  // membuka halaman /login
  if (to.path === '/login' && token) {

    next('/dashboard')

    return
  }


  next()
})


export default router