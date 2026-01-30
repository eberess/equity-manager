<template>
  <div class="min-h-screen flex items-center justify-center p-4" style="background-color: #eaedef">
    <div class="w-full max-w-md rounded-lg shadow-lg p-8" style="background-color: #ffffff">
      <h1 class="text-3xl font-bold mb-6 text-center" style="color: #191919">
        Créer un compte
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: #191919">Prénom</label>
            <input 
              v-model="form.firstName" 
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none"
              style="border-color: #cccccc; background-color: #ffffff"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: #191919">Nom</label>
            <input 
              v-model="form.lastName" 
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none"
              style="border-color: #cccccc; background-color: #ffffff"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Email</label>
          <input 
            v-model="form.email" 
            type="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style="border-color: #cccccc; background-color: #ffffff"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Password</label>
          <input 
            v-model="form.password" 
            type="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style="border-color: #cccccc; background-color: #ffffff"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Business Unit</label>
          <input 
            v-model="form.businessUnit" 
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style="border-color: #cccccc; background-color: #ffffff"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Nombre de parts</label>
          <input 
            v-model.number="form.shareCount" 
            type="number"
            min="1"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style="border-color: #cccccc; background-color: #ffffff"
            required
          />
        </div>

        <div v-if="error" class="p-3 rounded-lg" style="background-color: #fdeaea; color: #ea302d">
          {{ error }}
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 rounded-lg text-white font-semibold transition"
          style="background-color: #007f8c"
          @mouseover="onButtonHover"
          @mouseout="onButtonOut"
        >
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>

      <div class="mt-6 pt-6 border-t" style="border-color: #cccccc">
        <button 
          @click="$emit('switch-to-login')"
          class="w-full px-4 py-2 rounded-lg font-semibold transition"
          style="background-color: #e6e6e6; color: #191919"
          @mouseover="onLoginButtonHover"
          @mouseout="onLoginButtonOut"
        >
          Déjà inscrit ? Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  businessUnit: '',
  shareCount: 1,
})
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['register-success', 'switch-to-login'])

const onButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button && !loading.value) button.style.backgroundColor = '#006974'
}

const onButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button && !loading.value) button.style.backgroundColor = '#007f8c'
}

const onLoginButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#cccccc'
}

const onLoginButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#e6e6e6'
}

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await axios.post('http://localhost:3000/users/auth/register', form.value)
    
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    emit('register-success')
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}
</script>
