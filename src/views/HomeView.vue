<script setup lang="ts">

import { onMounted, ref } from "vue"
import BirdCard from "../components/BirdCard.vue"
import { getBirds } from "../services/api"
import type { Bird } from "../types/Bird"

const birds = ref<Bird[]>([])
const loading = ref(true)
const errorMessage = ref("")

onMounted(async () => {
  try {
    birds.value = await getBirds()
  } catch (error) {
    errorMessage.value = "Não foi possível carregar os pássaros."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-container">
    <div class="text-group">
      <h2 class="subtitle">Bem-vindo ao AvesBrasil!</h2>
      <h5 class="subtitle2">
        Nosso catálogo de pássaros disponíveis para registro de vendas e reservas:
      </h5>
    </div>

    <p v-if="loading" class="state-message">Carregando pássaros...</p>
    <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>

    <div v-else class="grid">
      <BirdCard
        v-for="bird in birds"
        :key="bird.id"
        :id="bird.id"
        :name="bird.name"
        :scientific="bird.scientific_name"
        :price="bird.price"
        :legalization="bird.legalization_price"
        :image="bird.image_url"
      />
    </div>
  </div>
</template>

<style scoped>

.text-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  margin-top: 10px;
}

.subtitle {
  font-size: 22px;
  color: #1e293b;
  line-height: 1.2;
  margin: 0;
}

.subtitle2 {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.2;
  margin: 5px 0;
}

.state-message {
  color: #64748b;
  margin: 0;
}

.error {
  color: #b91c1c;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

</style>
