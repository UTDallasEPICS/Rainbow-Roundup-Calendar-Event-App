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
  <Teleport to="body">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 class="text-xl font-bold text-zinc-800 mb-4">Edit User</h2>

        <div class="space-y-4">
          <!-- Editable Fields -->
          <div>
            <label class="block font-medium mb-1">First Name</label>
            <input
              v-model="selectedUser.firstname"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">Last Name</label>
            <input
              v-model="selectedUser.lastname"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">Email</label>
            <input
              v-model="selectedUser.email"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">Phone</label>
            <input
              v-model="selectedUser.phoneNum"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">Profile Picture URL</label>
            <input
              v-model="selectedUser.profilePic"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">Global Notification</label>
            <input
              type="checkbox"
              v-model="selectedUser.GlobalNotif"
              class="mr-2"
            />
            <span>{{ selectedUser.GlobalNotif ? "Enabled" : "Disabled" }}</span>
          </div>

          <!-- Admin status (read-only) -->
          <div>
            <label class="block font-medium mb-1">Admin Status</label>
            <p
              class="px-3 py-2 border border-gray-200 rounded text-sm font-semibold"
              :class="
                selectedUser.role === 'Admin'
                  ? 'text-red-500'
                  : 'text-green-600'
              "
            >
              {{ selectedUser.role }}
            </p>
          </div>

          <!-- Warning Toggle -->
          <div>
            <label class="block font-medium mb-1">Warning</label>
            <select
              v-model="hasWarning"
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>

          <!-- Warning Reason -->
          <div v-if="hasWarning">
            <label class="block font-medium mb-1">Reason</label>
            <input
              v-model="selectedUser.PotentialOffenses[0].reason"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <!-- Buttons -->
          <div class="flex justify-between pt-4 border-t">
            <button
              @click="deleteUser"
              class="text-red-600 hover:underline font-medium"
            >
              Delete User
            </button>

            <button
              @click="saveUserEdits"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
import { useFetch } from "#app"; // Nuxt 3's fetch composable
const { data } = useAuth();
console.log(data.value.user);
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

const selectedUser = ref(null);
const isModalOpen = ref(false);
const hasWarning = ref(false);

function openModal(user) {
  selectedUser.value = JSON.parse(JSON.stringify(user)); // deep clone
  hasWarning.value = user.PotentialOffenses?.length > 0;
  if (!selectedUser.value.PotentialOffenses) {
    selectedUser.value.PotentialOffenses = [{ reason: "" }];
  }
  isModalOpen.value = true;
}

function closeModal() {
  selectedUser.value = null;
  isModalOpen.value = false;
  hasWarning.value = false;
}

async function saveUserEdits() {
  const updateData = {};
  const body = selectedUser.value;

  if (body.email) updateData.email = body.email;
  if (body.firstname) updateData.firstname = body.firstname;
  if (body.lastname) updateData.lastname = body.lastname;
  if (body.phoneNum) updateData.phoneNum = body.phoneNum;
  if (body.profilePic) updateData.profilePic = body.profilePic;
  if (typeof body.GlobalNotif !== "undefined")
    updateData.GlobalNotif = body.GlobalNotif;

  if (hasWarning.value && body.PotentialOffenses?.[0]?.reason) {
    updateData.PotentialOffenses = [
      { reason: body.PotentialOffenses[0].reason },
    ];
  } else {
    updateData.PotentialOffenses = [];
  }

  // TODO: replace with your actual API endpoint
  await fetch(`/api/user/${body.id}`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    headers: { "Content-Type": "application/json" },
  });

  await fetch(`/api/user/${body.id}`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    headers: { "Content-Type": "application/json" },
  });

  const { data } = await useFetch("/api/user", { key: "refresh-users" });
  if (data.value?.success) {
    users.value = data.value.Users;
  }

  closeModal();
}

async function deleteUser() {
  if (!selectedUser.value?.id) return;
  const confirmed = confirm("Are you sure you want to delete this user?");
  if (!confirmed) return;

  await fetch(`/api/user/${selectedUser.value.id}`, {
    method: "DELETE",
  });

  const { data } = await useFetch("/api/user", { key: "refresh-users" });
  if (data.value?.success) {
    users.value = data.value.Users;
  }

  closeModal();
}
</script>
