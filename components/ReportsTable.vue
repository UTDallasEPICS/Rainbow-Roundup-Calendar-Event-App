<template>
    <div class="grid grid-cols-2 items-center">
        <h1 class="text-2xl font-bold text-zinc-700 col-span-1">Reports</h1>

        <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name…"
        class="w-full p-2 border border-gray-300 rounded col-span-1"
        />
    </div>
    <div
        v-if="reports" class="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-amber-300">
                <tr>
                    <th
                    @click="sortAsc = !sortAsc"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                    >
                    Reported On
                    <span>
                        {{ sortAsc ? "▲" : "▼" }}
                    </span>
                    </th>
                    <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    First Name
                    </th>
                    <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Last Name
                    </th>
                    <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Type
                    </th>
                    <th
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Comments
                    </th>
                    <th>
                        
                    </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                <tr
                    v-for="report in sortedReports"
                    :key="report"
                    @click=""
                    class="hover:bg-gray-100 cursor-pointer"
                >
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ formatDateTime(report.reportTime) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ report.ReportedUser.firstname }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ report.ReportedUser.lastname }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                        <span v-if="report.isUsername">Inappropriate Username</span>
                        <span v-else-if="report.isProfilePic">Inappropriate Profile Picture</span>
                        <span v-else>Other</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ report.description }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                        <button class="bg-gray-300 text-gray-800 px-4 py-2 mx-1 rounded hover:bg-gray-400 transition">Resolve</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else class="px-4 py-3 text-gray-400">
        No reports yet.
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps(['reports'])
const searchTerm = ref("");
const sortAsc = ref(true);
const selectedUser = ref(null);
const isModalOpen = ref(false);


const sortedReports = computed(() => {
  let list = props.reports;
  console.log(list)
  const q = searchTerm.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (u) =>
        u.ReportedUser.firstname?.toLowerCase().includes(q) ||
        u.ReportedUser.lastname?.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => {
    const A = String(a["reportTime"] || "").toLowerCase();
    const B = String(b["reportTime"] || "").toLowerCase();
    return sortAsc.value ? A.localeCompare(B) : B.localeCompare(A);
  });
});

// Formatting helper
function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function closeModal() {
  selectedUser.value = null;
  isModalOpen.value = false;
}

async function goToProfile(){
  await navigateTo(`/profile/${selectedUser.value.id}`);
}

</script>