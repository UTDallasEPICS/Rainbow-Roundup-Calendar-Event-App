<template>
    <div class="z-40 fixed inset-0 flex items-center justify-center p-4 font-sans">
        <div class="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm" @click="closeWindow()" />

        <div class="z-50 w-full max-w-sm bg-white rounded-2xl shadow-md relative">
            <div class="p-6 space-y-5">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-800">Edit Stock</h2>
                    <button type="button" aria-label="Close" class="text-gray-500 hover:text-gray-800" @click="closeWindow()">
                        &times;
                    </button>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Size</p>
                    <p class="text-lg font-semibold text-gray-800">{{ variant.size }}</p>
                </div>

                <label class="block text-sm font-medium text-gray-700" for="stock-remaining">
                    Stock Remaining
                    <input
                        id="stock-remaining"
                        v-model.number="editedStockRemaining"
                        type="number"
                        min="0"
                        step="1"
                        class="mt-1 w-full border border-gray-300 rounded p-2"
                    />
                </label>

                <p v-if="saveError" class="text-sm text-red-600">{{ saveError }}</p>

                <div class="flex justify-center gap-4">
                    <button
                        type="button"
                        class="bg-lime-300 px-4 py-2 rounded hover:bg-lime-400 cursor-pointer transition"
                        @click="saveChanges()"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer transition"
                        @click="revertChanges()"
                    >
                        Revert
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    itemId: {
        type: String,
        required: true,
    },
    variant: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["closeWindow", "stockUpdated"]);
const editedStockRemaining = ref(props.variant.stockRemaining);
const originalStockRemaining = ref(props.variant.stockRemaining);
const saveError = ref("");

function closeWindow() {
    emit("closeWindow");
}

function revertChanges() {
    editedStockRemaining.value = originalStockRemaining.value;
}

async function saveChanges() {
    const stockRemaining = Number(editedStockRemaining.value);

    if (!Number.isInteger(stockRemaining) || stockRemaining < 0) {
        saveError.value = "Stock Remaining must be a non-negative whole number.";
        return;
    }

    try {
        await $fetch(`/api/item/${props.itemId}`, {
            method: "PUT",
            body: {
                ItemVariants: [{
                    id: props.variant.id,
                    stockRemaining,
                }],
            },
        });

        emit("stockUpdated", stockRemaining);
        closeWindow();
    } catch (error) {
        console.error("Error saving stock:", error);
        saveError.value = "Could not save stock. Please try again.";
    }
}
</script>
