
 
<script setup lang="ts">

import { useRouter } from 'vue-router';

/*props = dados que o card recebe do componente pai cada card representa um pássaro*/

const props = defineProps({
  name: String,
  scientific: String,
  price: Number,
  legalization: Number,
  image: String,
  id: Number
})

const router = useRouter()
function handleRegister(){
  router.push(`/register/${props.id}`)
}


</script>

<template>

  <!-- CARD -->
  <div class="card">
    <div class="image">
      <img :src="image" alt="pássaro">

      <!-- BADGE -->
      <span class="badge">
        Legalizado
      </span>
    </div>

    <!-- INFORMAÇÕES -->
     <div class="info">
  <h2 class="name">
    {{ name }}
  </h2>


  <p class="scientific">
    {{ scientific }}
  </p>

  <p class="price">
    R$ {{ price }},00
  </p>

  <p class="tax">
    + Taxa de legalização: R$ {{ legalization }},00
  </p>

   <button class="btn-register" @click="handleRegister">
    Registrar
  </button>

</div>
  </div>
</template>

<style scoped>

/* cards */

.card{
background:white;
border-radius:14px;
overflow:hidden;
box-shadow:0 6px 16px rgba(0,0,0,0.08);
transition:0.25s;
cursor:pointer;
border:1px solid #e5e7eb;

}

.card:hover{
transform:translateY(-4px);
box-shadow:0 10px 22px rgba(0,0,0,0.12);
}

/* imagem */

.image{
position:relative;
height:180px;
overflow:hidden;
}

.image img{
width:100%;
height:100%;
object-fit:cover;
}

/* BADGE LEGALIZADO */

.badge{
position:absolute;
top:10px;
right:10px;
background: rgb(141, 182, 0);
color:white;
font-size:12px;
padding:4px 10px;
border-radius:8px;
font-weight:600;
}

/* INFORMAÇÕES */

.info{
padding:18px;
}

.name{
font-size:20px;
margin:0;
font-weight:600;
}

.scientific{
font-size:14px;
color:#6b7280;
margin-top:4px; 
}

.price{
margin-top:12px;
font-size:22px;
color: rgb(141, 182, 0);
font-weight:bold;
}

.tax{
margin-top:6px;
font-size:13px;
color:#6b7280;
}

.btn-register{
   margin-top: 14px;
  width: 100%;
  background: rgb(141, 182, 0);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-register:hover {
  background: #75aa31;
}

.name {
  flex: 1;
}
</style>
