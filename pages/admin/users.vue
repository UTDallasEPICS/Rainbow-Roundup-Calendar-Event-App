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
      <span class="text-2xl font-bold text-zinc-700">
        Manage Users
      </span>
      
      <div v-if="!isLoading" class="space-y-4">
        <ReportsTable :reports="reports" @user-banned="(id) => banUser(id)"/>
        <!-- <UsersTable :users="users" :title="'Users'" />
        <UsersTable :users="bannedUsers" :title="'Banned Users'" />
        <UsersTable :users="archivedUsers" :title="'Archived Users'" /> -->
      </div>
      <div v-else class="text-gray-400">
        Loading...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const users = ref([]);
const bannedUsers = ref([]);
const archivedUsers = ref([])
const reports = ref([]);
const attrs = useAttrs();
const isLoading = ref(true);

// get regular users
try {
  const { data: userData } = await useFetch("/api/user/", {
        query: { method: "GET" }
    })

  console.log(userData)
  //users.value = userData.value.Users;
  
} catch (err) {
  console.error("Error fetching users:", err);
}

// get banned and archived users
// try {
//   const { data: userData } = await useFetch("/api/archive/user", {
//     query: { method: "GET" }
//   });

//   if (userData.value.success && userData.value.Users.length > 0) {

//     // sort into banned and archived users
//     for (let i = 0; i < userData.value.Users.length; i++)
//     {
//       if (userData.value.Users[i].isBanned)
//       {
//         bannedUsers.value.push(userData.value.Users[i]);
//       }
//       else // user is archived
//       {
//         archivedUsers.value.push(userData.value.Users[i]);
//       }
//     }
//   }
// } catch (err) {
//   console.error("Error fetching users:", err);
// }

try {
  const response = await useFetch("/api/report", { query: { method: "GET" } });
  reports.value = response.data.value;
} catch (err) {
  console.error("Error fetching reports:", err);
}

isLoading.value = false;


// move an unbanned user to the banned user table
function banUser(banId) {
  for (let i = 0; i < users.value.length; i++)
  {
    if (users.value[i].id == banId)
    {
      bannedUsers.value.push(users.value.splice(i, 1)[0])
      break;
    }
  }
}
</script>
