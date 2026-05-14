<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { loginUser } from "@/services/api"

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const numbers = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  password.value = input.value
}

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    loading.value = true

    await loginUser(email.value, password.value)
    localStorage.setItem('loggedIn', 'true')
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-image-panel" aria-label="Aves">
      <img
        src="/birds.jpg"
        alt="Aves"
        class="login-image"
      />
    </section>

    <section class="login-form-panel">
      <div class="login-card">
        <div class="logo-container">
          <img
            src="/logo.png"
            alt="Logo AvesBrasil"
            class="logo"
          />
        </div>

        <div class="title-group">
          <h1>Login</h1>
          <p>Entre com o email e senha já cadastrados para acessar o sistema.</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <input
              v-model="email"
              type="email"
              placeholder="Digite o email"
              required
            />
          </div>

          <div class="input-group">
            <input
              :value="password"
              type="password"
              maxlength="6"
              placeholder="Digite a senha"
              required
              @input="numbers"
            />
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <button class="login-button" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 48%);
  overflow: hidden;
  background: #eef2e6;
}

.login-image-panel {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #dfe7d1;
}

.login-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.login-form-panel {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: linear-gradient(180deg, #f8faf4 0%, #edf3e2 100%);
}

.login-card {
  width: 100%;
  max-width: 430px;
  padding: 42px 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(141, 182, 0, 0.18);
  border-radius: 8px;
  box-shadow: 0 24px 60px rgba(30, 41, 59, 0.14);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.logo {
  width: 112px;
  height: 112px;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 10px 24px rgba(30, 41, 59, 0.16);
}

.title-group {
  width: 100%;
  text-align: center;
  margin-bottom: 32px;
}

.title-group h1 {
  margin: 0 0 10px;
  color: #1f2933;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
}

.title-group p {
  max-width: 320px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group input {
  width: 100%;
  height: 54px;
  border: 1px solid #d9dfd0;
  border-radius: 8px;
  background: #f7f9f3;
  padding: 0 18px;
  color: #1f2933;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}

.input-group input::placeholder {
  color: #9aa38e;
}

.input-group input:focus {
  background: #ffffff;
  border-color: rgb(141, 182, 0);
  box-shadow: 0 0 0 4px rgba(141, 182, 0, 0.16);
}

.login-button {
  width: 100%;
  height: 54px;
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  background: rgb(141, 182, 0);
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #789c00;
  box-shadow: 0 12px 22px rgba(141, 182, 0, 0.26);
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin: -6px 0 0;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    background: #edf3e2;
  }

  .login-image-panel {
    display: none;
  }

  .login-form-panel {
    padding: 28px;
  }

  .login-card {
    padding: 34px 26px;
  }

  .title-group h1 {
    font-size: 32px;
  }
}

</style>
