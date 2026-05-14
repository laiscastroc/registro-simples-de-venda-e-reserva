<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import SaleForm from "../components/SaleForm.vue"
import { getBirds } from "../services/api"
import type { Bird } from "../types/Bird"

const route = useRoute()

const birds = ref<Bird[]>([])
const bird = ref<Bird | null>(null)
const selectedBirdId = ref("")
const loading = ref(true)
const errorMessage = ref("")

const selectedBird = computed(() => {
  if (!selectedBirdId.value) return null

  return birds.value.find(item => item.id === Number(selectedBirdId.value)) || null
})

function syncSelectedBird(id: string | string[] | undefined) {
  selectedBirdId.value = id ? String(id) : ""
  bird.value = selectedBird.value
}

onMounted(async () => {
  try {
    birds.value = await getBirds()
    syncSelectedBird(route.params.id)
  } catch (error) {
    errorMessage.value = "Não foi possível carregar os pássaros."
  } finally {
    loading.value = false
  }
})

watch(
  () => route.params.id,
  (id) => {
    syncSelectedBird(id)
  }
)

watch(selectedBird, (newBird) => {
  bird.value = newBird
})
</script>

<template>
  <div class="page-container">
    <p v-if="loading" class="state-message">Carregando pássaros...</p>
    <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>

    <div v-else-if="!bird && !route.params.id" class="select-card">
      <h2>Registrar Compra</h2>
      <p>Selecione o pássaro para iniciar a venda. </p>

      <div class="field">
        <label>Pássaro</label>
        <select v-model="selectedBirdId">
          <option value="">Escolha um pássaro</option>
          <option
            v-for="item in birds"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <SaleForm
      v-if="bird"
      :bird="bird"
    />

    <div v-else-if="route.params.id" class="not-found">
      <h2>Pássaro não encontrado</h2>
      <p>Selecione um pássaro no catálogo para registrar.</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
  margin: 30px auto;
}

.state-message {
  color: #64748b;
  margin: 0;
}

.error {
  color: #b91c1c;
}

.select-card {
  max-width: 760px;
  margin: auto;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.select-card h2 {
  margin: 0;
  color: #111827;
}

.select-card p {
  margin-top: 6px;
  color: #6b7280;
}

.field {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.field label {
  margin-bottom: 8px;
  font-weight: 600;
}

.field select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.not-found {
  text-align: center;
  padding: 40px;
  background: #f9fafb;
  border-radius: 16px;
}
</style>
