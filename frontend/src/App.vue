<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLogin = computed(() => {
  return route.path === '/login'
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  router.push('/login')
}
</script>

<template>

  <!-- ============================= -->
  <!-- HALAMAN LOGIN -->
  <!-- ============================= -->

  <RouterView v-if="isLogin" />


  <!-- ============================= -->
  <!-- APLIKASI UTAMA -->
  <!-- ============================= -->

  <div v-else class="app-container">

    <!-- HEADER -->
    <header class="navbar">

      <div class="navbar-title">
        <h2>Sistem Buku Induk Sekolah</h2>
      </div>

      <button
        class="logout-button"
        @click="logout"
      >
        Logout
      </button>

    </header>


    <div class="main-layout">

      <!-- SIDEBAR -->
      <aside class="sidebar">

        <nav class="sidebar-menu">

          <RouterLink
            to="/dashboard"
            class="menu-item"
            active-class="active"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            to="/students"
            class="menu-item"
            active-class="active"
          >
            Data Siswa
          </RouterLink>

        </nav>

      </aside>


      <!-- CONTENT -->
      <main class="content">

        <RouterView />

      </main>

    </div>

  </div>

</template>


<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f9f9f9;
}


/* ================================= */
/* HEADER */
/* ================================= */

.navbar {
  height: 70px;

  background-color: #2c3e50;
  color: white;

  padding: 0 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar h2 {
  margin: 0;
  font-size: 22px;
}


/* ================================= */
/* LOGOUT */
/* ================================= */

.logout-button {
  padding: 9px 18px;

  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;

  background-color: transparent;
  color: white;

  font-size: 14px;
  cursor: pointer;

  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: white;
  color: #2c3e50;
}


/* ================================= */
/* MAIN LAYOUT */
/* ================================= */

.main-layout {
  display: flex;

  min-height: calc(100vh - 70px);
}


/* ================================= */
/* SIDEBAR */
/* ================================= */

.sidebar {
  width: 230px;

  background-color: white;

  border-right: 1px solid #ddd;

  padding: 20px 15px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: block;

  padding: 12px 15px;

  text-decoration: none;

  color: #333;

  border-radius: 6px;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item.active {
  background-color: #2c3e50;
  color: white;
}


/* ================================= */
/* CONTENT */
/* ================================= */

.content {
  flex: 1;

  padding: 30px;

  min-width: 0;
}

</style>