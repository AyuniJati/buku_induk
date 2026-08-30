import { createRouter, createWebHistory } from 'vue-router'

import StudentList from '../views/students/StudentList.vue'
import StudentCreate from '../views/students/StudentCreate.vue'
import StudentEdit from '../views/students/StudentEdit.vue'
import StudentDetail from '../views/students/StudentDetail.vue'

import ParentCreate from '../views/parents/ParentCreate.vue'
import ParentEdit from '../views/parents/ParentEdit.vue'

import EducationCreate from '../views/education/EducationCreate.vue'
import EducationEdit from '../views/education/EducationEdit.vue'


const router = createRouter({

  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [

    {
      path: '/',
      redirect: '/students'
    },

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
    // PARENTS
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
    }

  ]

})

export default router