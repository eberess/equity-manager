<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: #666666">Total Actionnaires</p>
            <p class="text-3xl font-bold mt-2" style="color: #191919">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: #d9f0f3">
            <span class="text-2xl">👥</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: #666666">Total Parts</p>
            <p class="text-3xl font-bold mt-2" style="color: #007f8c">{{ stats.totalShares }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: #d9f0f3">
            <span class="text-2xl">📊</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: #666666">Moyenne Parts/Personne</p>
            <p class="text-3xl font-bold mt-2" style="color: #007f8c">{{ stats.averageShares }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: #d9f0f3">
            <span class="text-2xl">📈</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Business Unit Distribution -->
      <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
        <h3 class="text-lg font-semibold mb-4" style="color: #191919">Répartition par Business Unit</h3>
        <Pie :data="businessUnitChartData" :options="chartOptions" />
      </div>

      <!-- Top Shareholders -->
      <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
        <h3 class="text-lg font-semibold mb-4" style="color: #191919">Top 5 Actionnaires</h3>
        <Bar :data="topShareholdersChartData" :options="barChartOptions" />
      </div>
    </div>

    <!-- Business Units Table -->
    <div class="rounded-lg p-6 shadow-sm" style="background-color: #ffffff; border: 1px solid #cccccc">
      <h3 class="text-lg font-semibold mb-4" style="color: #191919">Détails par Business Unit</h3>
      <table class="w-full">
        <thead style="background-color: #e6e6e6">
          <tr>
            <th class="p-3 text-left" style="color: #191919">Business Unit</th>
            <th class="p-3 text-right" style="color: #191919">Actionnaires</th>
            <th class="p-3 text-right" style="color: #191919">Total Parts</th>
            <th class="p-3 text-right" style="color: #191919">Pourcentage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bu, index) in businessUnitStats" :key="index" class="border-b" style="border-color: #e6e6e6">
            <td class="p-3" style="color: #191919">{{ bu.name }}</td>
            <td class="p-3 text-right" style="color: #666666">{{ bu.count }}</td>
            <td class="p-3 text-right font-mono font-bold" style="color: #007f8c">{{ bu.shares }}</td>
            <td class="p-3 text-right" style="color: #666666">{{ bu.percentage }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  businessUnit: string
  shareCount: number
}

const props = defineProps<{
  users: User[]
}>()

const stats = computed(() => {
  const totalUsers = props.users.length
  const totalShares = props.users.reduce((sum, user) => sum + user.shareCount, 0)
  const averageShares = totalUsers > 0 ? Math.round(totalShares / totalUsers) : 0
  
  return {
    totalUsers,
    totalShares,
    averageShares,
  }
})

const businessUnitStats = computed(() => {
  const buMap = new Map<string, { count: number; shares: number }>()
  
  props.users.forEach(user => {
    const bu = user.businessUnit
    if (!buMap.has(bu)) {
      buMap.set(bu, { count: 0, shares: 0 })
    }
    const current = buMap.get(bu)!
    current.count++
    current.shares += user.shareCount
  })
  
  const totalShares = stats.value.totalShares
  
  return Array.from(buMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      shares: data.shares,
      percentage: totalShares > 0 ? ((data.shares / totalShares) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.shares - a.shares)
})

const businessUnitChartData = computed(() => ({
  labels: businessUnitStats.value.map(bu => bu.name),
  datasets: [
    {
      data: businessUnitStats.value.map(bu => bu.shares),
      backgroundColor: [
        '#007f8c',
        '#48bac4',
        '#91d5db',
        '#0b96cc',
        '#605f9d',
        '#78be20',
      ],
    },
  ],
}))

const topShareholdersChartData = computed(() => {
  const top5 = [...props.users]
    .sort((a, b) => b.shareCount - a.shareCount)
    .slice(0, 5)
  
  return {
    labels: top5.map(u => `${u.firstName} ${u.lastName}`),
    datasets: [
      {
        label: 'Parts',
        data: top5.map(u => u.shareCount),
        backgroundColor: '#007f8c',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}
</script>
