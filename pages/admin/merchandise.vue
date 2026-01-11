<template>
<div>
    <EditItem v-if="isItemModalOpen" :item="selectedItem" @close-window="closeItemModal()" @item-created="(i) => {addItem(i)}"/>
    <div class="min-h-screen bg-gray-100 flex items-start justify-center p-8">
        <div class="max-w-4xl px-6 py-4 w-full">
            <!-- header -->
            <div class="flex flex-row items-center">
                <NuxtLink to="/admin" class="self-center">
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
                </svg> </NuxtLink>
                <span class="text-2xl font-bold text-zinc-700">
                    Manage Merchandise
                </span>
            </div>

            <!-- table -->
             <div class="grid grid-cols-2 items-center justify-between my-4 space-x-1">

                <input
                v-model="searchTerm"
                type="text"
                placeholder="Search by name…"
                class="w-full p-2 border border-gray-300 rounded col-span-1"
                />

                <div class="text-right">
                    <button class="bg-blue-300 p-2 rounded-md font-bold hover:bg-blue-400 cursor-pointer transition duration-150" @click="openAddItem()">
                        <span>+</span>
                        <span class="hidden sm:inline"> Add Item</span>
                    </button>
                </div>
            </div>
            <div
                v-if="sortedMerch && sortedMerch.length" class="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden"
            >
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-blue-300">
                        <tr>
                            <th
                            
                            class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 cursor-pointer select-none"
                            >
                                Item Name
                            </th>
                            <th
                            class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                            >
                                Price
                            </th>
                            <th
                            @click="sortAsc = !sortAsc"
                            class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none"
                            >
                                Availability
                                <span>
                                    {{ sortAsc ? "▲" : "▼" }}
                                </span>
                            </th>
                            <th
                            class="px-4 py-2 text-left text-xs font-extrabold uppercase text-zinc-700 select-none hidden md:table-cell"
                            >
                                Description
                            </th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                        <tr
                            v-for="merch in sortedMerch"
                            :key="merch"
                            @click="openItemModal(merch)"
                            class="hover:bg-gray-100 cursor-pointer"
                        >
                            <td class="px-4 py-3 text-sm text-gray-800 border">
                                {{ merch.name }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-800 border">
                                $ {{ merch.price.toFixed(2) }}
                            </td>
                            <td class="px-4 py-3 text-sm border">
                                <span v-if="!merch.isArchived" class="text-lime-600">Visible</span>
                                <span v-else class="text-red-600">Hidden</span>
                            </td>
                            <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-800 border">
                                <span v-if="merch.description != null && merch.description.length">{{ merch.description }}</span>
                                <span v-else class="text-gray-400">No description.</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else-if="isLoading" class="px-4 py-3 text-gray-400">
                Loading...
            </div>
            <div v-else class="px-4 py-3 text-gray-400">
                No merch.
            </div>
        </div>
    </div>
</div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { authClient } from "~/composables/auth"

const { data: session } = await authClient.getSession();
const isLoading = ref(true);

const searchTerm = ref("");
const sortAsc = ref(true);
const isItemModalOpen = ref(false);
const selectedItem = ref(null);
const merchandise = ref([]);

// fetch merch items
try {
    const { data: items } = await useFetch("/api/item/", {
        query: { method: "GET" }
    })

    const { data: archivedItems } = await useFetch("/api/archive/item", { query: { method: "GET" }})

     merchandise.value = items.value?.data.concat(archivedItems.value?.data);

}
catch (error) {
    console.error("Could not fetch items: ", error)
}
finally
{
    isLoading.value = false;
}


const sortedMerch = computed(() => {
  let list = merchandise.value;
  const q = searchTerm.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => {
    const A = String(a["isArchived"] || "").toLowerCase();
    const B = String(b["isArchived"] || "").toLowerCase();
    return sortAsc.value ? A.localeCompare(B) : B.localeCompare(A);
  });
});

function openItemModal(selected) {
  selectedItem.value = selected;
  isItemModalOpen.value = true;
}

function closeItemModal() {
  isItemModalOpen.value = false;
}

function openAddItem() {

    const newItem = {
        id: "",
        name: "",
        price: 0,
        description: "",
        isArchived: false,
        ItemVariants: [],
        ItemPhotos: [],
    }

    selectedItem.value = newItem

    
    isItemModalOpen.value = true;
}

function addItem(newItem) {
    merchandise.value.push(newItem);
    isItemModalOpen.value = false;
}

</script>