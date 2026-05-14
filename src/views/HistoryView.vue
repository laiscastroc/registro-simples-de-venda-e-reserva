<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { getSale } from "../services/api"
import type { Sale } from "../types/Sale"

const sales = ref<Sale[]>([])
const loading = ref(true)
const errorMessage = ref("")
const searchCPF = ref("")
const selectedBird = ref("")

onMounted(async () => {
  try {
    sales.value = await getSale()
  } catch (error) {
    console.error(error)
    errorMessage.value = "Não foi possível carregar o histórico."
  } finally {
    loading.value = false
  }
})

const birds = computed<string[]>(() => {
  return [...new Set<string>(sales.value.map((sale) => sale.bird_name))]
})

const filterSales = computed(() => {
  return sales.value.filter((sale) => {
    const matchCPF = sale.cpf.includes(searchCPF.value)
    const matchBird = selectedBird.value
      ? sale.bird_name === selectedBird.value
      : true

    return matchCPF && matchBird
  })
})
</script>

<template>
  <div class="page-container">
    <div class="container">
      <div class="header">
        <h2>Histórico de Vendas</h2>
        <span class="count">{{ filterSales.length }} registros</span>
      </div>

      <hr>

      <p v-if="loading" class="state-message">Carregando histórico...</p>
      <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>

      <template v-else>
        <div class="filters">
          <input
            v-model="searchCPF"
            placeholder="Buscar por CPF..."
          />

          <select v-model="selectedBird">
            <option value="">Todos os pássaros</option>
            <option v-for="bird in birds" :key="bird">
              {{ bird }}
            </option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Pássaro</th>
              <th>Qtd</th>
              <th>Comprador</th>
              <th>CPF</th>
              <th>Contato</th>
              <th>Pagamento</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="sale in filterSales" :key="sale.id">
              <td>{{ sale.created_at ? new Date(sale.created_at).toLocaleDateString() : "-" }}</td>
              <td>
                <strong>{{ sale.bird_name }}</strong>
              </td>
              <td>{{ sale.quantity }}</td>
              <td>{{ sale.buyer_name }}</td>
              <td>{{ sale.cpf }}</td>
              <td>{{ sale.contact }}</td>
              <td>
                <span class="badge payment">{{ sale.payment_method }}</span>
              </td>
              <td class="total">
                R$ {{ (sale.quantity * (sale.price || 0)).toFixed(2) }}
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    sale.status === 'VENDA' ? 'success' : 'danger'
                  ]"
                >
                  {{ sale.status === 'VENDA' ? 'Concluída' : 'Reserva' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container{
  max-width:1200px;
  margin:auto;
  padding:20px;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:0px;
}

.count{
  background:#e5e7eb;
  padding:4px 10px;
  border-radius:8px;
  font-size:14px;
}

.state-message {
  color: #64748b;
  margin: 0;
}

.error {
  color: #b91c1c;
}

.filters{
  display:flex;
  gap:10px;
  margin-bottom:20px;
}

.filters input,
.filters select{
  padding:10px;
  border-radius:8px;
  border:1px solid #d1d5db;
  flex:1;
}

table{
  width:100%;
  border-collapse:collapse;
  background:white;
  border-radius:12px;
  overflow:hidden;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
}

thead{
  background:#f1f5f9;
}

th, td{
  padding:12px;
  text-align:left;
  font-size:14px;
}

tbody tr{
  border-bottom:1px solid #e5e7eb;
}

.badge{
  padding:4px 10px;
  border-radius:8px;
  font-size:12px;
}

.success{
  background: rgb(141, 182, 0);;
  color: white;
}

.danger{
  background:#800000;
  color:white;
}

.total{
  color: rgb(141, 182, 0);
  font-weight:bold;
}

hr {
  border: none;
  height: 1px;
  background-color: #64748b;
  opacity: 0.3;
  margin-bottom: 50px;
  width: 100%;
}
</style>
