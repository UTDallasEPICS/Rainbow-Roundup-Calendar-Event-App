<template>
    <div class="grid grid-cols-2 items-center">
    <h1 class="text-2xl font-bold text-zinc-700 col-span-1">{{ title }}</h1>

    <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name…"
        class="w-full p-2 border border-gray-300 rounded col-span-1"
    />
    </div>
    <div
    class="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden"
    >
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-amber-300">
            <tr>
            <th
                @click="sortBy('firstname')"
                class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
            >
                First Name
                <span v-if="sortKey === 'firstname'">{{
                sortAsc ? "▲" : "▼"
                }}</span>
            </th>
            <th
                @click="sortBy('lastname')"
                class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
            >
                Last Name
                <span v-if="sortKey === 'lastname'">{{
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
                @click="sortBy('phoneNum')"
                class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
            >
                Phone
                <span v-if="sortKey === 'phoneNum'">{{
                sortAsc ? "▲" : "▼"
                }}</span>
            </th>
            <th
                @click="sortBy('role')"
                class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
            >
                Role
                <span v-if="sortKey === 'role'">{{
                sortAsc ? "▲" : "▼"
                }}</span>
            </th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
            <tr
            v-for="user in sortedUsers"
            :key="user.email"
            @click="clickUser(user)"
            class="hover:bg-gray-100 cursor-pointer"
            >
            <td class="px-4 py-3 text-sm text-gray-800 border">
                {{ user.firstname }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-800 border">
                {{ user.lastname }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-800 border">
                {{ user.email }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-800 border">
                {{ user.phoneNum }}
            </td>
            <td
                class="px-4 py-3 text-sm text-gray-800 border"
                :class="
                user.role === 'Admin'
                    ? 'text-red-500 font-bold'
                    : 'text-green-600'
                "
            >
                {{ user.role }}
            </td>
            </tr>
        </tbody>
        </table>
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

        <h2 class="text-xl font-bold text-zinc-800 mb-4">Edit User Role</h2>

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
            <label class="block font-medium mb-1">User Role</label>
            <select
              v-model="selectedUser.role"
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER">Super</option>
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

const props = defineProps(['users', 'title']);
//const users = ref([]);
import { authClient } from "~/server/auth"
const { data: session } = await authClient.getSession();
const sessionUser = session.user;
const searchTerm = ref("");
const sortKey = ref(null);
const sortAsc = ref(true);
const selectedUser = ref(null);
const isModalOpen = ref(false);


function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const sortedUsers = computed(() => {
  let list = props.users;
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

async function clickUser(user) {
  selectedUser.value = JSON.parse(JSON.stringify(user));
  if (sessionUser.role !== "SUPER") { // if user is not super, do not allow edit user role
    await goToProfile();
  }
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
