<template>
<!-- background -->
    <div
        class="fixed top-0 right-0 z-30 h-full w-full bg-black/70 backdrop-blur-sm"
    ></div>
    

<!-- window -->
    <div
    class="fixed top-0 right-0 z-40 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto"
    >
        <div
        class="z-40 w-full max-w-xl bg-white rounded-2xl shadow-md relative overflow-auto max-h-[70vh]"
        >
            <div class="absolute top-4 right-4 flex space-x-2 z-10">
                    <button @click="closeWindow()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5"
                        stroke="currentColor" class="w-4 h-4"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/> </svg>
                    </button>
            </div>


            <div class="p-6 space-y-6">
                <!-- title -->
                <div>
                    <h1 class="w-full text-xl font-semibold text-gray-800">Edit {{ item.name }}</h1>
                </div>

                <!-- name & price -->
                <div>
                    <div class="grid grid-cols-3">
                        <div class="col-span-2">
                            <h2 class="w-full text-lg font-semibold text-gray-800">Name</h2>
                            <input v-model="editedItem.name" placeholder="Item Name" class="w-3/4 border border-gray-300 p-1 rounded">
                            </input>
                        </div>
                        <div class="col-span-1">
                            <h2 class="w-full text-lg font-semibold text-gray-800">Price</h2>
                            <input v-model="editedItem.price" placeholder="Price" class="w-3/4 border border-gray-300 p-1 rounded">
                            </input>
                        </div>
                    </div>
                </div>

                <!-- description -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Description</h2>
                    <textarea v-model="editedItem.description" placeholder="Item Description" rows="3" class="w-full border border-gray-300 p-1 rounded">
                    </textarea>
                </div>

                <!-- sizes -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Sizes</h2>
                    <div class="flex flex-row flex-wrap gap-3">
                        <div v-for="variant in item.ItemVariants" class="border border-gray-300 w-20 rounded p-2">
                            <div class="align-center self-center text-center py-2">
                            {{ variant.size }}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- manage buttons -->
                 <div class="w-full flex justify-center gap-4">
                    <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 cursor-pointer transition" @click="saveChanges()">
                        Save Changes
                    </button>
                    <button class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="cancelEdit()">
                        Revert Changes
                    </button>
                
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['item']);
const emit = defineEmits(["closeWindow", "saveChanges"]);

const editedItem = reactive({
    id: props.item.id,
    name: props.item.name,
    price: props.item.price,
    description: props.item.description,
    isArchived: props.item.isArchived,
    itemVariants: props.item.ItemVariants,
    itemPhotos: props.item.ItemPhotos
});


function closeWindow() {
    emit("closeWindow");
}

async function saveChanges() {
    try {
        
        // await $fetch(`/api/report/${props.report.id}`, {
        //     method: "DELETE",
        // });
        emit('saveChanges', props.item.id)
        emit("closeWindow");
    }
    catch (error) {
        console.error("Error saving changes:", error);
        alert("Error saving changes. Please try again.");
    }
}

async function cancelEdit() {
    //editedItem.value = props.item
    editedItem.id = props.item.id
    editedItem.name = props.item.name
    editedItem.price = props.item.price
    editedItem.description = props.item.description
    editedItem.isArchived = props.item.isArchived
    editedItem.itemVariants = props.item.itemVariants,
    editedItem.itemPhotos = props.item.itemPhotos    
}

</script>