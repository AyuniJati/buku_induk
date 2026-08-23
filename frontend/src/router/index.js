import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '../views/students/StudentList.vue'
import StudentCreate from '../views/students/StudentCreate.vue' // Import halaman create
import StudentEdit from '../views/students/StudentEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    // Tambahkan route ini
    {
      path: '/students/create',
      name: 'student-create',
      component: StudentCreate
    },
    
    {
      path: '/students/:id/edit', // URL dinamis berdasarkan ID siswa
      name: 'student-edit',
      component: StudentEdit
    }
  ]
})

export default router