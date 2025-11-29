<template>
    <div class="grid grid-cols-2 items-center">
    <h1 class="text-2xl font-bold text-zinc-700 col-span-1">{{ title }}</h1>

    <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name..."
        class="w-full p-2 border border-gray-300 rounded col-span-1"
    />
    </div>
    <div
        v-if="sortedOrders && sortedOrders.length > 0" class="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-purple-300">
                <tr>
                    <th
                    @click="sortBy('placedAt')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                    >
                    Ordered On
                    <span v-if="sortKey === 'placedAt'">{{ sortAsc ? "▲" : "▼" }}</span>
                    </th>
                    <th
                    @click="sortBy('id')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    ID
                    <span v-if="sortKey === 'id'">{{ sortAsc ? "▲" : "▼" }}</span>
                    </th>
                    <th
                    @click="sortBy('status')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Status
                    <span v-if="sortKey === 'status'">{{ sortAsc ? "▲" : "▼" }}</span>
                    </th>
                    <th
                    @click="sortBy('orderType')"
                    class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Type
                    <span v-if="sortKey === 'orderType'">{{ sortAsc ? "▲" : "▼" }}</span>
                    </th>
                    <th
                    class="hidden md:table-cell px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                    >
                    Placed By
                    </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                <tr
                    v-for="order in sortedOrders"
                    :key="order"
                    @click="goToOrder(order.id)"
                    class="hover:bg-gray-100"
                >
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ formatDateTime(order.placedAt) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ order.id }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ order.status }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800 border">
                    {{ order.orderType }}
                    </td>
                    <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-800 border">
                    {{ order.User.firstname }} {{ order.User.lastname }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else class="px-4 py-3 text-gray-400">
        No orders.
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps(['orders', 'title']);
const searchTerm = ref("");
const sortKey = ref("")
const sortAsc = ref(true);

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const sortedOrders = computed(() => {
  let list = props.orders;
  const q = searchTerm.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (u) =>
        u.User.firstname.toLowerCase().includes(q) ||
        u.User.lastname.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => {
    const A = String(a[sortKey] || "").toLowerCase();
    const B = String(b[sortKey] || "").toLowerCase();
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

function goToOrder(id) {
    alert("TO DO: add navigation")
}
</script>
