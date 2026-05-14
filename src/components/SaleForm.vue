<script setup lang="ts">
import { ref, computed } from "vue"
import { createSale } from "@/services/api"

const props = defineProps<{ bird: any }>()

const buyer_name = ref("")
const cpf = ref("")
const contact = ref("")
const quantity = ref(1)
const gender = ref("Macho")
const payment_method = ref("Pix")
const includeLegalization = ref(true)
const saving = ref(false)
const authError = ref("")

function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

const subtotal = computed(() =>
  props.bird.price * quantity.value
)

const legalizationTotal = computed(() =>
  includeLegalization.value
    ? props.bird.legalization_price * quantity.value
    : 0
)

const total = computed(() =>
  subtotal.value + legalizationTotal.value
)

const submit = async (status: "VENDA" | "RESERVA") => {
  authError.value = ""

  if (localStorage.getItem("loggedIn") !== "true") {
    authError.value = "Erro ao registrar, faça o login primeiro."
    return
  }

  if (!buyer_name.value || !cpf.value || !contact.value) {
    alert("Preencha todos os campos obrigatórios.")
    return
  }

  saving.value = true

  try {
    const savedSale = await createSale({
      bird_id: props.bird.id,
      bird_name: props.bird.name,
      buyer_name: buyer_name.value,
      cpf: cpf.value,
      contact: contact.value,
      quantity: quantity.value,
      gender: gender.value,
      payment_method: payment_method.value,
      status
    })

    alert(`Registro salvo com sucesso! ID: ${savedSale.id}`)
    buyer_name.value = ""
    cpf.value = ""
    contact.value = ""
    quantity.value = 1
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    alert(`Não foi possível salvar o registro.\n\n${message}`)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <!-- CABEÇALHO -->
    <div class="header">
      <h2>Registrar Compra</h2>
      <p>Preencha os dados para concluir a venda</p>
    </div>

    <!-- CARD DA AVE -->
    <div class="bird-card">
      <img :src="bird.image_url" alt="ave" />

      <div class="bird-info">
        <h3>{{ bird.name }}</h3>
        <small>{{ bird.scientific_name }}</small>
        <span>R$ {{ bird.price.toFixed(2) }}</span>
      </div>
    </div>

    <!-- LINHA -->
    <div class="row">
      <div class="field">
        <label>Quantidade</label>
        <div class="qty-box">
          <button @click="decreaseQty">−</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQty">+</button>
        </div>
      </div>

      <div class="field">
        <label>Gênero</label>
        <select v-model="gender">
          <option>Macho</option>
          <option>Fêmea</option>
        </select>
      </div>
    </div>

    <!-- LEGALIZAÇÃO -->
    <div class="legalization">
      <div>
        <strong>Taxa de legalização</strong>
        <p>R$ {{ bird.legalization_price.toFixed(2) }} por unidade</p>
      </div>

      <input type="checkbox" v-model="includeLegalization" />
    </div>

    <!-- DADOS -->
    <div class="field">
      <label>Nome do comprador</label>
      <input v-model="buyer_name" placeholder="Digite o nome completo" />
    </div>

    <div class="field">
      <label>CPF</label>
      <input v-model="cpf" placeholder="000.000.000-00" />
    </div>

    <div class="field">
      <label>Contato</label>
      <input v-model="contact" placeholder="(00) 00000-0000" />
    </div>

    <div class="field">
      <label>Forma de pagamento</label>
      <select v-model="payment_method">
        <option>Pix</option>
        <option>Dinheiro</option>
        <option>Cartão de Crédito</option>
      </select>
    </div>

    <!-- RESUMO -->
    <div class="summary">
      <div>
        <span>Subtotal</span>
        <strong>R$ {{ subtotal.toFixed(2) }}</strong>
      </div>

      <div>
        <span>Legalização</span>
        <strong>R$ {{ legalizationTotal.toFixed(2) }}</strong>
      </div>

      <div class="total">
        <span>Total</span>
        <strong>R$ {{ total.toFixed(2) }}</strong>
      </div>
    </div>

    <!-- AÇÕES -->
    <div class="actions">
      <button class="reserve" :disabled="saving" @click="submit('RESERVA')">
        Reservar
      </button>

      <button class="sale" :disabled="saving" @click="submit('VENDA')">
        Registrar venda
      </button>
    </div>

    <p v-if="authError" class="auth-error">
      {{ authError }}
    </p>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 760px;
  margin: auto;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.header {
  margin-bottom: 28px;
}

.header h2 {
  margin: 0;
  color: #111827;
}

.header p {
  margin-top: 6px;
  color: #6b7280;
}

.bird-card {
  display: flex;
  gap: 20px;
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.bird-card img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
}

.bird-info h3 {
  margin: 0;
}

.bird-info small {
  color: #6b7280;
  display: block;
  margin: 4px 0;
}

.bird-info span {
  color: rgb(141, 182, 0);
  font-size: 24px;
  font-weight: bold;
}

.row {
  display: flex;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 22px;
}

.field label {
  margin-bottom: 8px;
  font-weight: 600;
}

.field input,
.field select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.qty-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-box button {
  width: 38px;
  height: 38px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
}

.legalization {
  display: flex;
  justify-content: space-between;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 24px;
}

.legalization p {
  margin: 4px 0 0;
  color: #6b7280;
}

.summary {
  background: #f9fafb;
  padding: 20px;
  border-radius: 14px;
  margin-top: 20px;
}

.summary div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  font-size: 22px;
  color: rgb(141, 182, 0);
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 14px;
  margin-top: 26px;
}

.actions button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.actions button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.reserve {
  background: #800000;
}

.sale {
  background: rgb(141, 182, 0);
}

.auth-error {
  margin: 16px 0 0;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
</style>
