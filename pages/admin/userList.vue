<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center p-6">
    <div class="w-full max-w-4xl space-y-4">
      <!-- 1) Back link -->
      <NuxtLink to="/admin" class="inline-flex items-center text-zinc-700 hover:text-zinc-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>


      <div
        class="bg-white rounded-[20px]
               shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)]
               overflow-hidden"
      >
        <div class="p-6">
          <h1 class="text-2xl font-bold text-zinc-700 mb-4">User List</h1>
            <!-- 2) Search box -->
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by name…"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <!-- existing sortable columns -->
                  <th @click="sortBy('firstName')" class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none">
                    First Name <span v-if="sortKey==='firstName'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('lastName')" class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none">
                    Last Name <span v-if="sortKey==='lastName'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('email')" class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none">
                    Email <span v-if="sortKey==='email'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('phone')" class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none">
                    Phone <span v-if="sortKey==='phone'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th @click="sortBy('status')" class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none">
                    Status <span v-if="sortKey==='status'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <!-- new columns -->
                  <th class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700">
                    Warning
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in displayedUsers" :key="user.email">
                  <td class="px-4 py-3 text-sm text-gray-800">{{ user.firstName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-800">{{ user.lastName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-800">{{ user.email }}</td>
                  <td class="px-4 py-3 text-sm text-gray-800">{{ user.phone }}</td>
                  <td
                    class="px-4 py-3 text-sm"
                    :class="user.status === 'Admin' 
                      ? 'text-red-500 font-bold' 
                      : 'text-green-600'"
                  >
                    {{ user.status }}
                  </td>
                  <!-- Warning column -->
                  <td class="px-4 py-3 text-sm" :class="user.hasWarning ? 'text-red-500 font-semibold' : 'text-gray-600'">
                    {{ user.hasWarning ? 'Yes' : 'No' }}
                  </td>
                  <!-- Reason column -->
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ user.hasWarning ? user.warningReason : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// just as filler until the database is fixed :p
const users = ref([
  {
    firstName: 'Alice', lastName: 'Smith',
    email: 'alice@example.com', phone: '123‑456‑7890',
    status: 'Admin',
    hasWarning: false,
    warningReason: ''
  },
  {
    firstName: 'Bob', lastName: 'Jones',
    email: 'bob@example.com', phone: '987‑654‑3210',
    status: 'User',
    hasWarning: true,
    warningReason: 'TOS violation'
  },
  {
    firstName: 'Carol', lastName: 'Taylor',
    email: 'carol@example.com', phone: '555‑123‑4567',
    status: 'User',
    hasWarning: false,
    warningReason: ''
  },
  {
    firstName: 'Kimblrf', lastName: 'hfhsdh',
    email: 'moingus@example.com', phone: '555‑123‑4567',
    status: 'Admin',
    hasWarning: true,
    warningReason: 'Spam activity'
  }
])

// 2) Search term
const searchTerm = ref('')
const sortKey = ref(null)
const sortAsc = ref(true)

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedUsers = computed(() => {
  let list = [...users.value]

  // filter first
  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase()
    list = list.filter(u =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    )
  }

  // then sort
  if (!sortKey.value) return list
  return list.sort((a, b) => {
    const A = String(a[sortKey.value]).toLowerCase()
    const B = String(b[sortKey.value]).toLowerCase()
    return sortAsc.value ? A.localeCompare(B) : B.localeCompare(A)
  })
})

// final displayed list
const displayedUsers = sortedUsers
</script>
