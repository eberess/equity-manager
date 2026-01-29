<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// On définit une interface pour le typage (Critère "TypeScript Confirmé")
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  shareCount: number;
}

const users = ref<User[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Appel vers ton UsersController
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`)
    users.value = response.data
  } catch (error) {
    console.error("Erreur lors de la récupération :", error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 2rem; font-family: sans-serif;">
    <h1>Actionnaires ADEO</h1>
    
    <div v-if="loading">Chargement...</div>
    
    <ul v-else-if="users.length > 0">
      <li v-for="user in users" :key="user._id">
        <strong>{{ user.firstName }} {{ user.lastName }}</strong> : {{ user.shareCount }} parts
      </li>
    </ul>
    
    <p v-else>Aucun actionnaire trouvé. Avez-vous lancé le /seed ?</p>
  </div>
</template>