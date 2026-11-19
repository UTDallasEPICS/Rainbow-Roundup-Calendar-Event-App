<template>


<!-- window -->
    <div
    class="z-40 fixed top-0 right-0 min-h-screen flex w-full items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto"
    >
        <!-- background -->
        <div
            class="fixed top-0 right-0 z-30 h-full w-full bg-black/70 backdrop-blur-sm" @click="closeWindow()"
        />
    
        <div
        class="z-50 w-full max-w-xl bg-white rounded-2xl shadow-md relative overflow-auto max-h-[70vh]"
        >
            <div class="absolute top-4 right-4 flex space-x-2 z-10">
                    <button @click="closeWindow()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                        </svg>
                    </button>
            </div>


            <div class="p-6 space-y-6">
                <!-- title -->
                <div>
                    <h1 v-if="isNew" class="w-full text-xl font-semibold text-gray-800">Add Member</h1>
                    <h1 v-else class="w-full text-xl font-semibold text-gray-800">Edit Member</h1>
                </div>

                <!-- name -->
                <div>
                    <div class="grid grid-cols-3">
                        <div class="col-span-2">
                            <h2 class="w-full text-lg font-semibold text-gray-800">Name</h2>
                            <input v-model="editedMember.name" placeholder="Member Name" class="w-3/4 border border-gray-300 p-1 rounded">
                            </input>
                        </div>
                    </div>
                </div>

                <!-- role -->
                <div>
                    <div class="grid grid-cols-3">
                        <div class="col-span-2">
                            <h2 class="w-full text-lg font-semibold text-gray-800">Role</h2>
                            <input v-model="editedMember.role" placeholder="Member Role" class="w-3/4 border border-gray-300 p-1 rounded">
                            </input>
                        </div>
                    </div>
                </div>

                <!-- description -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Description</h2>
                    <textarea v-model="editedMember.description" placeholder="Member Description" rows="3" class="w-full border border-gray-300 p-1 rounded"/>
                </div>
                
                <!-- manage buttons -->
                 <div class="w-full flex justify-center gap-4">
                    <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 cursor-pointer transition" @click="saveChanges()">
                        Save
                    </button>
                    <button v-if="!isNew" class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="cancelEdit()">
                        Revert
                    </button>
                    <button v-else class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="closeWindow()">
                        Cancel
                    </button>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['member']);
const emit = defineEmits(["closeWindow", "memberCreated", "memberUpdated"]);

const isNew = computed(() => {
    if (!props.member || props.member.id == "") {
        return true
    }
    return false
})

const editedMember = reactive({
    id: props.member.id,
    name: props.member.name,
    role: props.member.role,
    description: props.member.description,
});
function closeWindow() {
    emit("closeWindow");
}

async function saveChanges() {
    try {        
        if (!isNew.value) {
            await $fetch(`/api/aboutUs/${props.member.id}`, {
                method: "PUT",
                body: editedMember
            });
            emit("memberUpdated", { ...editedMember });
        }
        else {
            const newMember = await $fetch(`/api/aboutUs/`, {
                method: "POST",
                body: editedMember
            });

            emit('memberCreated', newMember.data)
        }

        props.member.name = editedMember.name
        props.member.role = editedMember.role
        props.member.description = editedMember.description
        emit("closeWindow");
        
    }
    catch (error) {
        console.error("Error saving changes:", error);
        alert("Error saving changes. Please try again.");
    }
}

async function cancelEdit() {
    editedMember.id = props.member.id
    editedMember.name = props.member.name
    editedMember.role = props.member.role
    editedMember.description = props.member.description
}


</script>
