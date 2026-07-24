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
        Manage Orders
      </span>
      
      <div v-if="!isLoading" class="space-y-4">
        <OrdersTable :orders="orders" :title="'Active Orders'" />
        <OrdersTable :orders="archivedOrders" :title="'Archived Orders'" />
      </div>
      <div v-else class="w-full text-center text-gray-400">
        Loading...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const orders = ref([]);
const archivedOrders = ref([]);
const attrs = useAttrs();
const isLoading = ref(true);

try {
    // fetch orders
    const { data: ordersData } = await useFetch(`/api/order`, {  // TODO: Do sorting on serverside
        query: { method: "GET" }
    }) 
    orders.value = ordersData.value.data
}
catch (err) {
    console.error("Error fetching orders:", err);
}
finally {
  // sort orders & archived orders
  for (let i = 0; i < orders.value.length; i++) {
      if (orders.value[i].status == "DELIVERED") {
          archivedOrders.value.push(orders.value.splice(i, 1)[0])
      }
  }
  
  isLoading.value = false;
}
</script>