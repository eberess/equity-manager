<template>
  <div class="min-h-screen flex items-center justify-center p-4" style="background-color: #eaedef">
    <div class="w-full max-w-md rounded-lg shadow-lg p-8" style="background-color: #ffffff">
      <h1 class="text-3xl font-bold mb-6 text-center" style="color: #191919">
        Equity Manager <span style="color: #007f8c">ADEO</span>
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Email</label>
          <input 
            v-model="email" 
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none"
            style="border-color: #cccccc; background-color: #ffffff"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" style="color: #191919">Password</label>
          <input 
            v-model="password" 
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none"
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
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-6 pt-6 border-t" style="border-color: #cccccc">
        <p style="color: #666666" class="text-center mb-3">Pas encore de compte ?</p>
        <button 
          @click="$emit('switch-to-register')"
          class="w-full px-4 py-2 rounded-lg font-semibold transition"
          style="background-color: #e6e6e6; color: #191919"
          @mouseover="onRegisterButtonHover"
          @mouseout="onRegisterButtonOut"
        >
          S'inscrire
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['login-success', 'switch-to-register'])

const onButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button && !loading.value) button.style.backgroundColor = '#006974'
}

const onButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button && !loading.value) button.style.backgroundColor = '#007f8c'
}

const onRegisterButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#cccccc'
}

const onRegisterButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#e6e6e6'
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await axios.post('http://localhost:3000/users/auth/login', {
      email: email.value,
      password: password.value,
    })
    
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    emit('login-success')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
