<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center p-6">
    <div class="w-full max-w-4xl space-y-4">
      <!-- 1) Back link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center text-zinc-700 hover:text-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </NuxtLink>

      <div
        class="bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden"
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
                  <th
                    @click="sortBy('firstName')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                  >
                    First Name
                    <span v-if="sortKey === 'firstName'">{{
                      sortAsc ? "▲" : "▼"
                    }}</span>
                  </th>
                  <th
                    @click="sortBy('lastName')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                  >
                    Last Name
                    <span v-if="sortKey === 'lastName'">{{
                      sortAsc ? "▲" : "▼"
                    }}</span>
                  </th>
                  <th
                    @click="sortBy('email')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                  >
                    Email
                    <span v-if="sortKey === 'email'">{{
                      sortAsc ? "▲" : "▼"
                    }}</span>
                  </th>
                  <th
                    @click="sortBy('phone')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                  >
                    Phone
                    <span v-if="sortKey === 'phone'">{{
                      sortAsc ? "▲" : "▼"
                    }}</span>
                  </th>
                  <th
                    @click="sortBy('status')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                  >
                    Status
                    <span v-if="sortKey === 'status'">{{
                      sortAsc ? "▲" : "▼"
                    }}</span>
                  </th>
                  <!-- new columns -->
                  <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700"
                  >
                    Warning
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700"
                  >
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in displayedUsers" :key="user.email">
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ user.firstname }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ user.lastname }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ user.email }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ user.phoneNum }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm"
                    :class="
                      user.role === 'Admin'
                        ? 'text-red-500 font-bold'
                        : 'text-green-600'
                    "
                  >
                    {{ user.role }}
                  </td>
                  <!-- Warning column -->
                  <!-- Warning column -->
                  <td
                    class="px-4 py-3 text-sm"
                    :class="
                      user.PotentialOffenses?.length > 0
                        ? 'text-red-500 font-semibold'
                        : 'text-gray-600'
                    "
                  >
                    {{ user.PotentialOffenses?.length > 0 ? "Yes" : "No" }}
                  </td>

                  <!-- Reason column -->
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{
                      user.PotentialOffenses?.length > 0
                        ? user.PotentialOffenses[0].reason
                        : "—"
                    }}
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
import { ref, computed, onMounted } from "vue";
import { useFetch } from "#app"; // Nuxt 3's fetch composable

const users = ref([]); // empty initially

const searchTerm = ref("");
const sortKey = ref(null);
const sortAsc = ref(true);

// 1. Fetch the users from your backend when mounted
onMounted(async () => {
  const { data, error } = await useFetch("/api/user");
  if (error.value) {
    console.error("Error fetching users:", error.value);
  } else if (data.value?.success) {
    users.value = data.value.Users;
    console.log(users.value);
  } else {
    console.error("Unexpected response:", data.value);
  }
});

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const sortedUsers = computed(() => {
  let list = [...users.value];

  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase();
    list = list.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
    );
  }

  if (!sortKey.value) return list;
  return list.sort((a, b) => {
    const A = String(a[sortKey.value] || "").toLowerCase();
    const B = String(b[sortKey.value] || "").toLowerCase();
    return sortAsc.value ? A.localeCompare(B) : B.localeCompare(A);
  });
});

const displayedUsers = sortedUsers;
</script>
