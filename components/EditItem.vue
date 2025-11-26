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
                    <h2 class="w-full text-lg font-semibold text-gray-800">Sizes
                        <span class="text-gray-400 text-sm font-normal">Click to enable/disable.</span>
                    </h2> 
                    
                    <div class="flex flex-row flex-wrap gap-3">
                        <div v-for="variant in editedItem.ItemVariants" class="border border-gray-300 size-14 rounded p-2 cursor-pointer" :class="{ 'bg-gray-200': !variant.availability, 'text-gray-500': !variant.availability }" @click="changeSizeAvailability(variant)">
                            <div class="align-center self-center text-center py-2">
                            {{ variant.size }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- images -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Images
                        <span class="text-gray-400 text-sm font-normal">Changes to images cannot be reverted.</span>
                    </h2>
                    <div class="flex gap-3 flex-wrap">
                        <div v-for="image in editedItem.ItemPhotos">
                            <button @click="deletePhoto(image.id)" class="w-full flex justify-end z-50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5"
                                stroke="currentColor" class="size-4 absolute"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/> </svg>
                            </button>
                            <img :src="image.url" class="size-24 md:size-48"></img>
                        </div>
                        <label for="photo-upload" class="flex align-center justify-center text-center border-4 border-dashed border-gray-300 text-gray-500 rounded-xl size-24 md:size-48 cursor-pointer" >
                            + Add Photo
                        </label>
                        <input type="file" accept="image/*" id="photo-upload" @change="handleFileChange">
                    </div>
                </div>

                <!-- visibility -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Visibiity</h2>
                    <div class="flex gap-2">
                        <input type="radio" name="archived" v-model="archived" value="false">
                            <label for="false">Available</label>
                        </input>
                        <input type="radio" name="archived" v-model="archived" value="true">
                            <label for="true">Hidden</label>
                        </input>
                    </div>
                </div>
                
                <!-- manage buttons -->
                 <div class="w-full flex justify-center gap-4">
                    <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 cursor-pointer transition" @click="saveChanges()">
                        Save
                    </button>
                    <button class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="cancelEdit()">
                        Revert
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
    ItemVariants: props.item.ItemVariants.map(a => {return {...a}}),
    ItemPhotos: props.item.ItemPhotos,
});
function closeWindow() {
    emit("closeWindow");
}

const archived = ref((props.item.isArchived ? "true" : "false"))

async function saveChanges() {
    try {
        editedItem.isArchived = (archived.value == "true" ? true : false)
        props.item.name = editedItem.name
        props.item.price = editedItem.price
        props.item.description = editedItem.description
        props.item.isArchived = editedItem.isArchived
        props.item.ItemVariants = editedItem.ItemVariants

        await $fetch(`/api/item/${props.item.id}`, {
            method: "PUT",
            body: props.item
        });

        emit('saveChanges', props.item.id)
        emit("closeWindow");
    }
    catch (error) {
        console.error("Error saving changes:", error);
        alert("Error saving changes. Please try again.");
    }
}

async function cancelEdit() {
    editedItem.id = props.item.id
    editedItem.name = props.item.name
    editedItem.price = props.item.price
    editedItem.description = props.item.description
    editedItem.isArchived = props.item.isArchived
    archived.value = (props.item.isArchived ? "true" : "false")
    editedItem.ItemVariants = props.item.ItemVariants.map(a => {return {...a}}),
    editedItem.ItemPhotos = props.item.ItemPhotos
}

function changeSizeAvailability(variant) {
    variant.availability = !variant.availability;
}


function handleFileChange(event) {
  const input = event.target;
  if (input.files?.[0]) {
    addPhoto(input.files[0])
  }
}


async function addPhoto(file) {
    const form = new FormData()
    form.append("image", file)

    const { data: image } = await $fetch(`/api/itemPhoto/${props.item.id}`, {
        method: "POST",
        body: form
    });

    // add new image to item obj
    props.item.ItemPhotos.push(image);
}

async function deletePhoto(id) {
    await $fetch(`/api/itemPhoto/${id}`, {
        method: "DELETE",
    });

    for (let i = 0; i < editedItem.ItemPhotos.length; i++)
    {
        if (id == editedItem.ItemPhotos[i].id)
        {
            editedItem.ItemPhotos.splice(i, 1)
        }
    }
}
</script>