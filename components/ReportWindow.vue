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
                    <h1 class="w-full text-xl font-semibold text-gray-800">Resolve Report on {{ report.ReportedUser.firstname }} {{ report.ReportedUser.lastname }}</h1>
                    <div class="text-gray-400">
                        <div>Report made by 
                            <span>{{ report.ReporterUser.firstname }} {{ report.ReporterUser.lastname }}</span>
                        </div>
                        <div>
                            Made on {{ formatDateTime(report.reportTime) }}
                        </div>
                    </div>
                </div>

                <!-- type -->
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Type</h2>
                    <div class="grid grid-cols-2">
                        <div class="col-span-1">
                            <span v-if="report.isUsername">Inappropriate Username</span>
                            <span v-else-if="report.isProfilePic">Inappropriate Profile Picture</span>
                            <span v-else>Other</span>
                        </div>
                        <div v-if="report.isProfilePic" class="col-span-1 flex justify-center">
                            <img class="size-20 rounded-full object-cover" :src="report.ReportedUser.profilePic" alt="Profile picture">
                        </div>
                    </div>
                </div>

                <!-- description -->
                <div v-if="report.description != null">
                    <h2 class="w-full text-lg font-semibold text-gray-800">Additional Comments</h2>
                    <div class="">
                        {{ report.description }}
                    </div>
                </div>
                
                <!-- manage buttons -->
                 <div class="w-full flex justify-center gap-4">
                    <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 transition" @click="deleteReport()">
                        Delete Report
                    </button>
                    <button class="bg-red-500 text-white px-4 py-2 mx-1 rounded hover:bg-red-600 transition" @click="banUser()">
                        Ban User
                    </button>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['report']);
const emit = defineEmits(["closeWindow", "reportDeleted", "userBanned"]);

// Formatting helper
function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "numeric"
  });
}

function closeWindow() {
    emit("closeWindow");
}

async function deleteReport() {
    try {
        await $fetch(`/api/report/${props.report.id}`, {
            method: "DELETE",
        });
        emit('reportDeleted', props.report.id)
        emit("closeWindow");
    }
    catch (error) {
        console.error("Error deleting report:", error);
        alert("Error deleting report. Please try again.");
    }
}

async function banUser() {
    console.log("TO DO: implement bans")
    emit('userBanned', props.report.ReportedUser.id)
    emit("closeWindow");
}

</script>