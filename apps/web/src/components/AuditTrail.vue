<template>
  <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
    <h3 class="text-lg font-semibold mb-4" style="color: #191919">📋 Historique des modifications</h3>
    
    <div v-if="loading" class="text-center py-8" style="color: #666666">
      Chargement de l'historique...
    </div>

    <div v-else-if="auditLogs.length === 0" class="text-center py-8" style="color: #666666">
      Aucun historique disponible
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="log in auditLogs" 
        :key="log._id"
        class="p-4 rounded-lg border"
        style="border-color: #e6e6e6; background-color: #f9f9f9"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <span 
              class="inline-block px-2 py-1 rounded text-xs font-semibold mr-2"
              :style="getActionStyle(log.action)"
            >
              {{ getActionLabel(log.action) }}
            </span>
            <span class="font-medium" style="color: #191919">{{ log.userName }}</span>
            <span style="color: #666666"> ({{ log.userEmail }})</span>
          </div>
          <span class="text-sm" style="color: #666666">{{ formatDate(log.createdAt) }}</span>
        </div>

        <div class="text-sm" style="color: #666666">
          <span class="font-medium">Type:</span> {{ log.entityType }}
          <span v-if="log.entityId" class="ml-2">
            <span class="font-medium">ID:</span> {{ log.entityId.substring(0, 8) }}...
          </span>
        </div>

        <!-- Show changes for UPDATE -->
        <div v-if="log.action === 'UPDATE' && log.newValues" class="mt-2 text-sm">
          <details>
            <summary class="cursor-pointer" style="color: #007f8c">Voir les modifications</summary>
            <div class="mt-2 p-2 rounded" style="background-color: #ffffff">
              <div v-for="(value, key) in log.newValues" :key="key" class="mb-1">
                <span class="font-medium">{{ key }}:</span>
                <span style="color: #666666"> {{ formatValue(value) }}</span>
              </div>
            </div>
          </details>
        </div>

        <!-- Show data for CREATE -->
        <div v-if="log.action === 'CREATE' && log.newValues" class="mt-2 text-sm">
          <details>
            <summary class="cursor-pointer" style="color: #007f8c">Voir les données créées</summary>
            <div class="mt-2 p-2 rounded" style="background-color: #ffffff">
              <div v-for="(value, key) in log.newValues" :key="key" class="mb-1">
                <span class="font-medium">{{ key }}:</span>
                <span style="color: #666666"> {{ formatValue(value) }}</span>
              </div>
            </div>
          </details>
        </div>

        <!-- Show deleted data for DELETE -->
        <div v-if="log.action === 'DELETE' && log.oldValues" class="mt-2 text-sm">
          <details>
            <summary class="cursor-pointer" style="color: #ea302d">Voir les données supprimées</summary>
            <div class="mt-2 p-2 rounded" style="background-color: #fdeaea">
              <div v-for="(value, key) in log.oldValues" :key="key" class="mb-1">
                <span class="font-medium">{{ key }}:</span>
                <span style="color: #666666"> {{ formatValue(value) }}</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface AuditLog {
  _id: string
  userId: string
  userEmail: string
  userName: string
  action: string
  entityType: string
  entityId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  createdAt: string
}

const auditLogs = ref<AuditLog[]>([])
const loading = ref(true)

const loadAuditLogs = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('access_token')
    const response = await axios.get('http://localhost:3000/audit', {
      headers: { Authorization: `Bearer ${token}` },
    })
    auditLogs.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des audits:', error)
  } finally {
    loading.value = false
  }
}

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    CREATE: 'CRÉÉ',
    UPDATE: 'MODIFIÉ',
    DELETE: 'SUPPRIMÉ',
    LOGIN: 'CONNEXION',
    LOGOUT: 'DÉCONNEXION',
  }
  return labels[action] || action
}

const getActionStyle = (action: string) => {
  const styles: Record<string, string> = {
    CREATE: 'background-color: #ebf5de; color: #46a610',
    UPDATE: 'background-color: #daeff7; color: #007bb4',
    DELETE: 'background-color: #fdeaea; color: #ea302d',
    LOGIN: 'background-color: #d9f0f3; color: #007f8c',
    LOGOUT: 'background-color: #e6e6e6; color: #666666',
  }
  return styles[action] || 'background-color: #e6e6e6; color: #666666'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatValue = (value: any) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}

onMounted(() => {
  loadAuditLogs()
})
</script>
