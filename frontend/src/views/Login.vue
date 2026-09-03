<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = ''

  if (!username.value || !password.value) {
    errorMessage.value = 'Username dan password wajib diisi.'
    return
  }

  loading.value = true

  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'Login gagal. Silakan periksa username dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">

      <!-- Logo -->
      <div class="logo-wrapper">
        <div class="logo">
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M32 8C20 8 11 12 7 16v34c6-4 14-6 25-3V13c0-2-1-4-3-5h3c11 0 19 3 25 8v34c-6-4-14-6-25-3"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M32 13v34"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <div class="login-header">
        <h1>Sistem Buku Induk</h1>
        <p>Silakan login untuk melanjutkan</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="login-form">

        <!-- Username -->
        <div class="form-group">
          <label for="username">Username</label>

          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21C20 17.6863 17.3137 15 14 15H10C6.68629 15 4 17.6863 4 21"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
              </svg>
            </span>

            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Masukkan username"
              autocomplete="username"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>

          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <path
                  d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </span>

            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              autocomplete="current-password"
              :disabled="loading"
            />

            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :aria-label="
                showPassword
                  ? 'Sembunyikan password'
                  : 'Tampilkan password'
              "
            >
              <!-- Eye -->
              <svg
                v-if="!showPassword"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 12C2.5 12 6 6.5 12 6.5C18 6.5 21.5 12 21.5 12C21.5 12 18 17.5 12 17.5C6 17.5 2.5 12 2.5 12Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>

              <!-- Eye off -->
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3L21 21"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M10.6 6.7C11.05 6.57 11.52 6.5 12 6.5C18 6.5 21.5 12 21.5 12C21.5 12 20.2 14.05 18.05 15.6"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M6.1 8.35C3.75 9.95 2.5 12 2.5 12C2.5 12 6 17.5 12 17.5C13.25 17.5 14.4 17.25 15.45 16.85"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M9.9 9.9C9.35 10.45 9 11.2 9 12C9 13.65 10.35 15 12 15C12.8 15 13.55 14.65 14.1 14.1"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="error-message">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M12 8V12"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <circle
              cx="12"
              cy="16"
              r="1"
              fill="currentColor"
            />
          </svg>

          <span>{{ errorMessage }}</span>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner"></span>

          <span>
            {{ loading ? 'Memproses...' : 'Login' }}
          </span>

          <svg
            v-if="!loading"
            class="button-arrow"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M13 6L19 12L13 18"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <div class="footer-line"></div>

        <div class="footer-content">
          <span class="footer-dot"></span>
          <span>Sistem Informasi Sekolah</span>
        </div>

        <p>© 2026 Buku Induk Sekolah</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(
      circle at top left,
      rgba(44, 62, 80, 0.07),
      transparent 35%
    ),
    #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 430px;
  background: #ffffff;
  border: 1px solid #e6e9ed;
  border-radius: 18px;
  padding: 38px 40px 30px;
  box-shadow:
    0 15px 40px rgba(31, 41, 55, 0.08),
    0 3px 10px rgba(31, 41, 55, 0.04);
}

/* =========================
   LOGO
========================= */

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.logo {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #2c3e50;
  background: #eef2f6;
  border: 1px solid #dce3ea;
}

.logo svg {
  width: 35px;
  height: 35px;
}

/* =========================
   HEADER
========================= */

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  margin: 0;
  color: #25384d;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.login-header p {
  margin: 8px 0 0;
  color: #7a8490;
  font-size: 14px;
}

/* =========================
   FORM
========================= */

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a95a1;
  pointer-events: none;
}

.input-icon svg {
  width: 19px;
  height: 19px;
}

.input-wrapper input {
  width: 100%;
  height: 48px;
  padding: 0 44px 0 44px;
  border: 1px solid #d5dbe1;
  border-radius: 9px;
  outline: none;
  background: #ffffff;
  color: #273444;
  font-family: inherit;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.input-wrapper input::placeholder {
  color: #a1a9b2;
}

.input-wrapper input:hover {
  border-color: #b8c1ca;
}

.input-wrapper input:focus {
  border-color: #34495e;
  box-shadow: 0 0 0 3px rgba(52, 73, 94, 0.09);
}

.input-wrapper input:disabled {
  cursor: not-allowed;
  background: #f6f7f8;
}

/* =========================
   PASSWORD TOGGLE
========================= */

.password-toggle {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #8a95a1;
  cursor: pointer;
}

.password-toggle:hover {
  color: #34495e;
}

.password-toggle svg {
  width: 19px;
  height: 19px;
}

/* =========================
   ERROR
========================= */

.error-message {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: -4px 0 18px;
  padding: 11px 12px;
  border: 1px solid #f0caca;
  border-radius: 8px;
  background: #fff5f5;
  color: #b42318;
  font-size: 13px;
  line-height: 1.45;
}

.error-message svg {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  margin-top: 1px;
}

/* =========================
   LOGIN BUTTON
========================= */

.login-button {
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: none;
  border-radius: 9px;
  background: #2c3e50;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;
}

.login-button:hover:not(:disabled) {
  background: #223344;
  box-shadow: 0 5px 14px rgba(44, 62, 80, 0.18);
}

.login-button:active:not(:disabled) {
  transform: translateY(1px);
}

.login-button:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.button-arrow {
  width: 18px;
  height: 18px;
}

/* =========================
   LOADING
========================= */

.spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   FOOTER
========================= */

.login-footer {
  margin-top: 28px;
  text-align: center;
}

.footer-line {
  width: 100%;
  height: 1px;
  margin-bottom: 17px;
  background: #edf0f2;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #7c8792;
  font-size: 12px;
}

.footer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #718096;
}

.login-footer p {
  margin: 7px 0 0;
  color: #a0a8b1;
  font-size: 11px;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 520px) {
  .login-page {
    padding: 25px 16px;
  }

  .login-card {
    max-width: 100%;
    padding: 32px 25px 26px;
    border-radius: 15px;
  }

  .login-header h1 {
    font-size: 23px;
  }
}

@media (max-width: 360px) {
  .login-card {
    padding: 28px 20px 24px;
  }

  .login-header {
    margin-bottom: 25px;
  }
}
</style>