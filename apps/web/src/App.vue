<template>
  <!-- Auth pages -->
  <Login v-if="!isAuthenticated && currentPage === 'login'" @login-success="handleLoginSuccess" @switch-to-register="currentPage = 'register'" />
  <Register v-else-if="!isAuthenticated && currentPage === 'register'" @register-success="handleRegisterSuccess" @switch-to-login="currentPage = 'login'" />

  <!-- Main app -->
  <div v-else class="min-h-screen p-8" style="background-color: #eaedef">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-4xl font-bold mb-2" style="color: #191919">
              Equity Manager <span style="color: #007f8c">ADEO</span>
            </h1>
            <p style="color: #666666">Bienvenue {{ currentUser?.firstName }} ({{ currentUser?.role }})</p>
          </div>
          <button 
            @click="handleLogout"
            class="px-6 py-2 rounded-lg text-white font-semibold transition"
            style="background-color: #ea302d"
            @mouseover="onLogoutButtonHover"
            @mouseout="onLogoutButtonOut"
          >
            Déconnexion
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 border-b" style="border-color: #cccccc">
          <button 
            @click="currentTab = 'dashboard'"
            class="px-4 py-2 font-semibold transition"
            :style="currentTab === 'dashboard' ? 'color: #007f8c; border-bottom: 2px solid #007f8c' : 'color: #666666'"
          >
            📊 Dashboard
          </button>
          <button 
            @click="currentTab = 'list'"
            class="px-4 py-2 font-semibold transition"
            :style="currentTab === 'list' ? 'color: #007f8c; border-bottom: 2px solid #007f8c' : 'color: #666666'"
          >
            👥 Actionnaires
          </button>
        </div>
      </header>

      <!-- Modal pour créer/éditer -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
          <h2 class="text-2xl font-bold mb-6" style="color: #191919">
            {{ editingUser ? 'Modifier un actionnaire' : 'Ajouter un actionnaire' }}
          </h2>
          
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1" style="color: #191919">Prénom *</label>
              <input 
                v-model="formData.firstName" 
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style="border-color: #cccccc; background-color: #ffffff"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" style="color: #191919">Nom *</label>
              <input 
                v-model="formData.lastName" 
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style="border-color: #cccccc; background-color: #ffffff"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" style="color: #191919">Email *</label>
              <input 
                v-model="formData.email" 
                type="email"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style="border-color: #cccccc; background-color: #ffffff"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" style="color: #191919">Business Unit *</label>
              <input 
                v-model="formData.businessUnit" 
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style="border-color: #cccccc; background-color: #ffffff"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" style="color: #191919">Nombre de parts *</label>
              <input 
                v-model.number="formData.shareCount" 
                type="number"
                min="1"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style="border-color: #cccccc; background-color: #ffffff"
                required
              />
            </div>

            <div v-if="formError" class="p-3 rounded-lg" style="background-color: #fdeaea; color: #ea302d">
              {{ formError }}
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 rounded-lg transition"
                style="background-color: #e6e6e6; color: #191919"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="flex-1 px-4 py-2 rounded-lg text-white transition font-semibold"
                style="background-color: #007f8c"
                @mouseover="onSubmitButtonHover"
                @mouseout="onSubmitButtonOut"
              >
                {{ editingUser ? 'Mettre à jour' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Dashboard Tab -->
      <Dashboard v-if="currentTab === 'dashboard'" :users="users" :isAdmin="currentUser?.role === 'admin'" />

      <!-- List Tab -->
      <div v-else-if="currentTab === 'list'">
        <!-- Bouton d'ajout et export -->
        <div class="mb-6 flex gap-4">
          <button 
            v-if="canEditUsers"
            @click="openModal"
            class="px-6 py-3 rounded-lg text-white font-semibold shadow-md transition"
            style="background-color: #007f8c"
            @mouseover="onAddButtonHover"
            @mouseout="onAddButtonOut"
          >
            + Ajouter un actionnaire
          </button>
          
          <button 
            @click="exportToCSV"
            class="px-6 py-3 rounded-lg font-semibold shadow-md transition"
            style="background-color: #e6e6e6; color: #191919"
            @mouseover="onExportButtonHover"
            @mouseout="onExportButtonOut"
          >
            Exporter CSV
          </button>
        </div>

        <!-- Tableau des actionnaires -->
        <main class="rounded-xl shadow-sm overflow-hidden" style="background-color: #ffffff; border: 1px solid #cccccc">
        <div v-if="loading" class="p-8 text-center" style="color: #808080">
          Chargement des données...
        </div>
        
        <table v-else-if="users.length > 0" class="w-full text-left border-collapse">
          <thead style="background-color: #e6e6e6; border-bottom: 1px solid #b3b3b3">
            <tr>
              <th class="p-4 font-semibold" style="color: #191919">Nom</th>
              <th class="p-4 font-semibold" style="color: #191919">Email</th>
              <th class="p-4 font-semibold" style="color: #191919">Business Unit</th>
              <th class="p-4 font-semibold text-right" style="color: #191919">Parts</th>
              <th class="p-4 font-semibold text-right" style="color: #191919">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id" class="border-b" style="border-bottom: 1px solid #e6e6e6; background-color: #ffffff"
              @mouseover="onRowHover"
              @mouseout="onRowOut"
            >
              <td class="p-4 font-medium" style="color: #191919">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-4" style="color: #666666">{{ user.email }}</td>
              <td class="p-4" style="color: #666666; font-style: italic">{{ user.businessUnit }}</td>
              <td class="p-4 text-right font-mono font-bold" style="color: #007f8c">{{ user.shareCount }}</td>
              <td class="p-4 text-right">
                <button 
                  v-if="canEditUsers"
                  @click="editUser(user)"
                  class="px-3 py-1 rounded text-white text-sm mr-2 transition"
                  style="background-color: #0b96cc"
                  @mouseover="onEditButtonHover"
                  @mouseout="onEditButtonOut"
                >
                  Éditer
                </button>
                <button 
                  v-if="canDeleteUsers"
                  @click="deleteUser(user._id)"
                  class="px-3 py-1 rounded text-white text-sm transition"
                  style="background-color: #ea302d"
                  @mouseover="onDeleteButtonHover"
                  @mouseout="onDeleteButtonOut"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

          <div v-else class="p-8 text-center" style="color: #808080">
            Aucun actionnaire trouvé.
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Dashboard from './components/Dashboard.vue'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  businessUnit: string
  shareCount: number
  createdAt: string
  updatedAt: string
}

interface CurrentUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

const isAuthenticated = ref(false)
const currentPage = ref('login')
const currentTab = ref('dashboard')
const currentUser = ref<CurrentUser | null>(null)
const users = ref<User[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingUser = ref<User | null>(null)
const formError = ref('')
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  businessUnit: '',
  shareCount: 1,
})

const canEditUsers = computed(() => {
  return currentUser.value?.role === 'admin' || currentUser.value?.role === 'editor'
})

const canDeleteUsers = computed(() => {
  return currentUser.value?.role === 'admin'
})

// Button hover handlers
const onLogoutButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#c61112'
}

const onLogoutButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#ea302d'
}

const onAddButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#006974'
}

const onAddButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#007f8c'
}

const onSubmitButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#006974'
}

const onSubmitButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#007f8c'
}

const onEditButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#007bb4'
}

const onEditButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#0b96cc'
}

const onDeleteButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#c61112'
}

const onDeleteButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#ea302d'
}

const onExportButtonHover = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#cccccc'
}

const onExportButtonOut = (event: Event) => {
  const button = event.target as HTMLButtonElement
  if (button) button.style.backgroundColor = '#e6e6e6'
}

const onRowHover = (event: Event) => {
  const row = event.currentTarget as HTMLTableRowElement
  if (row) row.style.backgroundColor = '#d9f0f3'
}

const onRowOut = (event: Event) => {
  const row = event.currentTarget as HTMLTableRowElement
  if (row) row.style.backgroundColor = '#ffffff'
}

const loadUsers = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('access_token')
    const response = await axios.get('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    users.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des actionnaires:', error)
  } finally {
    loading.value = false
  }
}

const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  const user = localStorage.getItem('user')
  if (token && user) {
    isAuthenticated.value = true
    currentUser.value = JSON.parse(user)
    loadUsers()
  }
}

const handleLoginSuccess = () => {
  checkAuth()
}

const handleRegisterSuccess = () => {
  checkAuth()
}

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  currentUser.value = null
  currentPage.value = 'login'
}

const openModal = () => {
  editingUser.value = null
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    businessUnit: '',
    shareCount: 1,
  }
  formError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
}

const editUser = (user: User) => {
  editingUser.value = user
  formData.value = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    businessUnit: user.businessUnit,
    shareCount: user.shareCount,
  }
  formError.value = ''
  showModal.value = true
}

const saveUser = async () => {
  try {
    formError.value = ''
    const token = localStorage.getItem('access_token')
    if (editingUser.value) {
      await axios.put(`http://localhost:3000/users/${editingUser.value._id}`, formData.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      await axios.post('http://localhost:3000/users', formData.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    closeModal()
    await loadUsers()
  } catch (error: any) {
    formError.value = error.response?.data?.message || 'Erreur lors de la sauvegarde'
    console.error('Erreur:', error)
  }
}

const deleteUser = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet actionnaire ?')) {
    try {
      const token = localStorage.getItem('access_token')
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await loadUsers()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }
}

const exportToCSV = async () => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await axios.get('http://localhost:3000/users/export/csv', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `shareholders-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    alert('Erreur lors de l\'export CSV')
  }
}

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
</style>
