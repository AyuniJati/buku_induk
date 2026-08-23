<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="navbar">
      <h2>Sistem Buku Induk Sekolah</h2>
    </header>

    <!-- Komponen RouterView ini yang akan memunculkan halaman StudentList -->
    <RouterView />
  </div>
</template>

<style>
/* Reset style dasar bawaan Vue agar tampilan kita lebih bersih */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f9f9f9;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar h2 {
  margin: 0;
}
</style>