<template>
  <div
    v-bind="attrs"
    class="min-h-screen bg-gray-100 flex items-start justify-center p-6"
  >
    <div class="w-full max-w-4xl space-y-4">
      <!-- 1) Back link -->
      <NuxtLink
        to="/admin"
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
                <tr
                  v-for="user in displayedUsers"
                  :key="user.email"
                  @click="openModal(user)"
                  class="hover:bg-gray-100 cursor-pointer"
                >
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
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{
                      user.PotentialOffenses?.length > 0
                        ? user.PotentialOffenses[0].description
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

  <Teleport to="body">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          @click="closeModal"
          class="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 class="text-xl font-bold text-zinc-800 mb-4">Edit Admin Status</h2>

        <div class="space-y-4">
          <div>
            <label class="block font-medium mb-1">Name</label>
            <p class="px-3 py-2 border border-gray-200 rounded text-sm">
              {{ selectedUser.firstname }} {{ selectedUser.lastname }}
            </p>
          </div>

          <div>
            <label class="block font-medium mb-1">Email</label>
            <p class="px-3 py-2 border border-gray-200 rounded text-sm">
              {{ selectedUser.email }}
            </p>
          </div>

          <div>
            <label class="block font-medium mb-1">Admin Status</label>
            <select
              v-model="selectedUser.role"
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER">SUPER</option>
            </select>
          </div>

          <div class="flex justify-end pt-4 border-t">
            <button
              @click="goToProfile"
              class="bg-gray-300 text-gray-800 px-4 py-2 mx-1 rounded hover:bg-gray-400 transition"
            >
              Visit Profile
            </button>
            <button
              @click="saveUserEdits"
              class="bg-blue-600 text-white px-4 py-2 ml-1 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const { data } = useAuth();
console.log(data.value.user.role);

const users = ref([]);
const searchTerm = ref("");
const sortKey = ref(null);
const sortAsc = ref(true);
const selectedUser = ref(null);
const isModalOpen = ref(false);
const attrs = useAttrs();

onMounted(async () => {
  try {
    const response = await $fetch("/api/user");
    if (response?.success) {
      users.value = response.Users;
    }
  } catch (err) {
    console.error("Error fetching users:", err);
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
  const q = searchTerm.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (u) =>
        u.firstname?.toLowerCase().includes(q) ||
        u.lastname?.toLowerCase().includes(q)
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

function openModal(user) {
  if (data.value.user.role !== "SUPER") {
    return; // Block access
  }
  selectedUser.value = JSON.parse(JSON.stringify(user));
  isModalOpen.value = true;
}

function closeModal() {
  selectedUser.value = null;
  isModalOpen.value = false;
}

async function goToProfile(){
  await navigateTo(`/profile/${selectedUser.value.id}`);
}

async function saveUserEdits() {
  const updateData = { role: selectedUser.value.role };

  try {
    await $fetch(`/api/user/${selectedUser.value.id}`, {
      method: "PATCH",
      body: updateData,
      headers: { "Content-Type": "application/json" },
    });

    const refreshed = await $fetch("/api/user");
    if (refreshed?.success) {
      users.value = refreshed.Users;
    }
  } catch (err) {
    console.error("Error saving user edits:", err);
  }

  closeModal();
}
</script>
