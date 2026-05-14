<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faFileLines, faCartArrowDown, faCircleUser } from "@fortawesome/free-solid-svg-icons"

const route = useRoute()
const router = useRouter()
const isLogged = ref(false)
const showLogoutMenu = ref(false)
const syncLoginState = () => {
  isLogged.value = localStorage.getItem("loggedIn") === "true"
}

const handleLoginStatusClick = () => {
  if (isLogged.value) {
    showLogoutMenu.value = !showLogoutMenu.value
  } else {
    router.push("/login")
  }
}

const logout = () => {
  localStorage.removeItem("loggedIn")
  isLogged.value = false
  showLogoutMenu.value = false
  router.push("/")
}

onMounted(() => {
  syncLoginState()
  window.addEventListener("storage", syncLoginState)
})

watch(
  () => route.fullPath,
  () => {
    syncLoginState()
    showLogoutMenu.value = false
  }
)

const isPurchaseActive = computed(() => {
  return route.path === "/" || route.path.startsWith("/register")
})

const isLoginPage = computed(() => {
  return route.path === "/login"
})

</script>

<template>
  <div class="page-container">
    <template v-if="!isLoginPage">
      <header class="header-container">
        <router-link to="/" class="logo-link">
          <img
            src="/logo.png"
            alt="Logo"
            class="header-logo"
          />
        </router-link>

        <div class="text-group">
          <h1 class="header-title">
            AvesBrasil
          </h1>

          <h3 class="header-subtitle">
            Sistema de registro de aves
          </h3>
        </div>

        <div class="login-area">
          <button
            class="login-status"
            type="button"
            @click="handleLoginStatusClick" >
            <FontAwesomeIcon
              :icon="faCircleUser"
              class="login-icon"
            />

            <span>
              {{ isLogged ? 'Bem-vindo(a)!' : 'Login' }}
            </span>
          </button>

          <button
            v-if="isLogged && showLogoutMenu"
            class="logout-button"
            type="button"
            @click="logout" >
            Logout
          </button>
        </div>
      </header>
      <hr>

      <div class="nav-container">
        <div class="actions-buttons">
          <router-link
            to="/register"
            class="btn btn-primary"
            :class="{ active: isPurchaseActive }" >
            <FontAwesomeIcon :icon="faCartArrowDown" />
            Nova compra
          </router-link>

          <router-link
            to="/history"
            class="btn btn-secondary"
            :class="{ active: route.path === '/history' }" >
            <FontAwesomeIcon :icon="faFileLines" />
            Histórico
          </router-link>
        </div>
      </div>
    </template>

    <router-view />
    <footer
      v-if="!isLoginPage"
      class="footer" >
      <p> © 2026 AvesBrasil. Todos os direitos reservados | Contato: laisccastroc2023@gmail.com | GitHub: https://github.com/laiscastroc </p>
    </footer>

  </div>
</template>

<style>

body{
  margin: 0;
  padding: 0;
}

</style>

<style scoped>

/* HEADER */
.header-container {
  height: 80px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  gap: 12px;
}

/* TÍTULO */
.text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.header-title,
.header-subtitle {
  margin: 0;
}

.header-title {
  color: #1e293b;
  font-size: 1.5rem;
  line-height: 1;
}

.header-subtitle {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.2;
}

/* LOGO */
.header-logo {
  height: 50px;
  width: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: block;
}

.login-area {
  margin-left: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* LOGIN */
.login-status {
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
}

.login-status:hover {
  opacity: 0.85;
}

.login-icon {
  font-size: 40px;
  color: rgb(141, 182, 0);
}

.login-status span {
  margin-top: 4px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.logout-button {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 92px;
  padding: 9px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
  cursor: pointer;
  z-index: 10;
}

.logout-button:hover {
  background: #f9fafb;
  color: #b91c1c;
}

/* BOTÕES */
.nav-container {
  width: 90%;
  padding: 0;
  margin: 30px auto;
  max-width: 1000px;
}

.actions-buttons {
  display: inline-flex;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
  margin-top: 30px;
}

.btn {
  width: 130px;
  padding: 10px 18px;
  font-size: 15px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  gap: 6px;
  white-space: nowrap;
  background: transparent;
  color: #374151;
  transition: 0.2s;
}

.btn.active {
  background-color: rgb(141, 182, 0);
  color: white;
}

.actions-buttons {
  display: inline-flex;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
}

/* HR */
hr {
  border: none;
  height: 1px;
  background-color: #64748b;
  opacity: 0.08;
  margin-top: 0;
}

/* FOOTER */
.footer {
  margin-top: 80px;
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* LOGO LINK */
.logo-link {
  display: inline-flex;
  align-items: center;
  outline: none;
  text-decoration: none;
}

.logo-link:focus {
  outline: none;
}

.logo-link img {
  display: block;
}

</style>
