<!-- 24 sep 2025
    a modal window that lets all users see an event's details. used in /calendar and /eventsPage. it should let SUPER and ADMIN edit and/or delete events
-->

<template>
<!-- added a parent wrapper to make some warnings go away-->
<div>
  <!-- Background -->
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
        <!-- Edit/Save/Cancel Controls -->
        <div
            v-if="isAdmin && !isArchived"
        >
            <button
            v-if="!isEditing"
            @click="toggleEdit"
            class="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-1"
            >
            Edit
            </button>
            <template v-else>
            <button
                :disabled="isSavingChanges"
                @click="saveChanges()"
                class="bg-indigo-600 text-white px-4 py-1 rounded-full hover:bg-indigo-700 transition"
            >
                {{ isSavingChanges ? "Saving…" : "Save" }}
            </button>
            <button
                :disabled="isSavingChanges"
                @click="cancelEdit"
                class="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-full transition"
            >
                Cancel
            </button>
            </template>
        </div>
        <button @click="closeWindow()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/> </svg>
        </button>
      </div>

      <!-- Gradient header -->
      <div class="h-20 bg-rr-yellow relative">
        <div class="absolute inset-0 opacity-10" />
      </div>

      <div class="p-6 space-y-6">
       
        <!-- Title & metadata -->
        <div class="space-y-1">
          <div v-if="!isEditing">
            <h1 class="text-2xl font-semibold text-gray-800">
              {{ event?.title || "Loading…" }}
            </h1>
          </div>
          <div v-else>
            <input
              v-model="editedEvent.title"
              class="w-full text-2xl font-semibold text-gray-800 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          
          <p v-if="!isLoading && !isEditing" class="text-sm text-gray-500">
            {{ formatDateTime(event.start) }} •
            {{ formatDateTime(event.end) }}
            <span
              class="ml-2 uppercase bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ event.timeZone }}
            </span>
          </p>
          <div v-else-if="!isLoading" class="flex text-sm">
            <!-- start -->
            <div class="flex-initial pr-2">
                <div class="row-span-1 font-medium text-gray-800">Start:</div>
                <input
                  type="datetime-local"
                  v-model="editedEvent.startTime"
                  class="input w-full row-span-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 p-1"
                />
            </div>
            <div class="flex-initial px-2">
                <div class="row-span-1 font-medium text-gray-800">End:</div>
                <input
                  type="datetime-local"
                  v-model="editedEvent.endTime"
                  class="input w-full row-span-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 p-1"
                />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div
          v-if="!isLoading && !isEditing"
          class="text-sm text-gray-700 leading-relaxed"
        >
          {{ event.description }}
        </div>
        <div v-else-if="isEditing">
          <textarea
            v-model="editedEvent.description"
            rows="4"
            class="w-full text-sm text-gray-700 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div v-else class="text-center text-gray-500">Loading event…</div>

        <!-- Details grid -->
        <div
          v-if="!isLoading"
          class="grid grid-cols-2 gap-4 text-sm text-gray-600"
        >
        <!-- location -->
          <div>
            <span class="font-medium text-gray-800">Location:</span><br />
            <span v-if="!isEditing">{{ event.location }}</span>
            <input
              v-else
              v-model="editedEvent.location"
              class="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 mt-1"
            />
          </div>
          <!-- capacity -->
          <div>
            <span class="font-medium text-gray-800">Capacity:</span><br />
            <span v-if="!isEditing"
              >{{ event.currentCapacity ?? "N/A" }}/{{
                event.capacity ?? "N/A"
              }}</span
            >
            <input
              v-else
              type="number"
              v-model.number="editedEvent.capacity"
              class="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 mt-1"
            />
          </div>
        </div>

        <!-- Event image carousel -->
        <section v-if="!isLoading" aria-label="Event photos">
          <h2 class="text-sm font-medium text-gray-800 mb-2">Event Photos</h2>
          <div
            class="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              v-if="eventImages.length"
              :src="eventImages[activeImageIndex].url"
              :alt="`${event.title} photo ${activeImageIndex + 1}`"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-sm text-gray-500"
            >
              Event photos will appear here
            </div>

            <template v-if="eventImages.length > 1">
              <button
                type="button"
                aria-label="Previous event photo"
                class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow hover:bg-white"
                @click="showPreviousImage"
              >
                <span aria-hidden="true">&lt;</span>
              </button>
              <button
                type="button"
                aria-label="Next event photo"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow hover:bg-white"
                @click="showNextImage"
              >
                <span aria-hidden="true">&gt;</span>
              </button>
              <div
                class="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white"
                aria-live="polite"
              >
                {{ activeImageIndex + 1 }} / {{ eventImages.length }}
              </div>
            </template>
          </div>
          <div v-if="isAdmin && isEditing" class="mt-3 flex gap-2">
            <input
              ref="imageFileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="handleImageUpload"
            />
            <button
              type="button"
              :disabled="isSavingChanges"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-50"
              @click="openImageFilePicker"
            >
              Add images
            </button>
            <button
              type="button"
              :disabled="!eventImages.length || isSavingChanges"
              class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="deleteCurrentImage"
            >
              Remove current image
            </button>
          </div>
          <p v-if="isAdmin && isEditing" class="mt-2 text-xs text-gray-500">
            Image changes are saved when you press Save.
          </p>
          <p
            v-if="imageUploadError"
            role="alert"
            class="mt-2 text-sm text-red-600"
          >
            {{ imageUploadError }}
          </p>
        </section>

        <!-- Map -->
        <div v-if="!isLoading">
             <Map :address="editedEvent.location" />
        </div>

        <div v-if="!isLoading && !isEditing && (!isPastEvent || isAdmin)">
            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Who's going: tried to make clickable -->
            <div v-if="!isLoading">
            <h2 class="text-sm font-medium text-gray-800 mb-2">People Going</h2>
            <ul class="space-y-2 max-h-32 overflow-y-auto pr-2 text-gray-700">
                <li
                v-for="signup in event.signUps"
                :key="signup.id"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                @click="navigateToUserProfile(signup.userId)"
                >
                <img
                    :src="
                    userMap[signup.userId]?.profilePic || '/default-profile.png'
                    "
                    alt="Profile"
                    class="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div>
                    <p class="font-medium text-indigo-600 hover:text-indigo-800">
                    {{ userMap[signup.userId]?.firstname || "Unknown" }}
                    {{ userMap[signup.userId]?.lastname || "" }}

                    <li v-if="!((signup.plusOneKids + signup.plusOneAdults) === 0)" class="text-gray-400 ">
                      Plus one signups: {{signup.plusOneKids + signup.plusOneAdults }}
                    </li>
                    <li v-if="(signup.plusOneKids + signup.plusOneAdults) > 0 &&
                         isAdmin" class="text-gray-400 ">
                      Adults: {{signup.plusOneAdults }}, Kids: {{signup.plusOneKids }}
                    </li> 
                    </p>
                </div>
                </li>
                <div v-if="!event.signUps.length" class="text-gray-400 italic">
                No one has signed up yet.
                </div>
            </ul>
            </div>

            <div v-if="!isPastEvent" class="mt-4 space-y-2">
            <p class="text-sm font-medium text-gray-800">Will you attend?</p>
            <div class="flex gap-3">
                <button
                @click="rsvpClickResponse('yes')"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    (rsvpChoice === 'yes' || userRSVP === 'yes') && rsvpChoice != 'no' && (isResponding === false) // The ? runs if the statement is true, : runs otherwise
                    ? 'bg-green-400 text-white'
                    : 'bg-green-200 hover:bg-green-300',
                ]"
                >
                Yes
                </button>
                <button
                @click="rsvpClickResponse('no')"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    (rsvpChoice === 'no' || userRSVP === 'no') && rsvpChoice != 'yes' && (isResponding === false)// The ? runs if the statement is true, : runs otherwise
                    ? 'bg-red-600 text-white'
                    : 'bg-red-200 hover:bg-red-300',
                ]"
                >
                No
                </button>
            </div>
            <div v-if="rsvpChoice ==  'yes'" class="gap-3">
              <label class="block mt-4 text-sm font-medium text-gray-700">How many adults are going to join you?</label>
                <div class="flex space-x-6 mt-1 border-solid border-gray-700">
                  <input
                  type="number"
                  id="numPlusOneAdults"
                  v-model.number="numPlusOneAdults"
                  :min="0"
                  />
                </div>
            </div>
            <div v-if="rsvpChoice ==  'yes'" class="gap-3">
              <label class="block mt-4 text-sm font-medium text-gray-700">How many kids are going to join you?</label>
                <div class="flex space-x-6 mt-1 border-solid border-gray-700">
                  <input
                  type="number"
                  id="numPlusOneKids"
                  v-model.number="numPlusOneKids"
                  :min="0"
                  />
                </div>
            </div>
            <div v-if="rsvpChoice ==  'no'" class="gap-3">
              <label class="block mt-4 text-sm font-medium text-gray-700">Note that this will additionally remove all 'plus one' signups</label>
            </div>
            <div v-if="rsvpChoice" class="flex gap-3">
              
                <button
                @click="respondToEvent(rsvpChoice)"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    'bg-blue-500 hover:bg-blue-600',
                ]"
                >
                Save
                </button>
            </div>
            <div v-if="isResponding" class="flex gap-3">
              
                <label class="block mt-4 text-sm font-medium text-gray-700">Processing...</label>
            </div>
            </div>
            <div v-if="rsvpError" class="mt-2 text-sm text-red-600 font-medium"> {{ rsvpError }}
            </div>
            <div v-if="rsvpOk" class="mt-2 text-sm text-green-600 font-medium"> {{ rsvpOk }}
            </div>
        </div>
        <!-- Event ID -->
        <p v-if="!isLoading" class="text-[10px] text-gray-400 text-center">
          ID: {{ event.id }}
        </p>

        <!-- Delete at bottom -->
        <div v-if="isEditing" class="mt-6">
          <button
            @click="deleteEvent()"
            class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
</div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
//import { useAuth } from "#imports"; // todo: figure out why useAuth is called here or if we don't need to touch it. 
import { authClient } from "~/composables/auth"
import { fetchCombinedEventById } from "~/server/utils/fetchCombinedEvents";
import { useRoute, useRouter } from "vue-router";


const { data: session } = await authClient.getSession();

const props = defineProps(['eventId']);
const emit = defineEmits(["closeViewEventWindow", "eventDeleted", "eventEdited"]);
function closeWindow() {
    if (isSavingChanges.value) return;
    discardPendingImageChanges();
    emit("closeViewEventWindow");
}

// State
const rsvpChoice = ref('');
const rsvpError = ref('');  
const rsvpOk = ref('');      
const numPlusOneAdults = ref(0);
const numPlusOneKids = ref(0);
const isEditing = ref(false);
const isArchived = ref(true)
const isPastEvent = ref(true);
const isAdmin = computed(() => {
  return (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER' ? true : false)
})
const editedEvent = reactive({
  id: props.eventId,
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  capacity: 0,
  location: "",
  address: "",
  eventLat: null,
  eventLong: null,
});
const isResponding = ref(false);
const rsvpResponse = ref(null);

// Auth & routing

const user = session.user;
const route = useRoute();
const router = useRouter();
const eventId = props.eventId;

// Event data
const event = ref(null);
const isLoading = ref(true);
const userMap = ref({});
const pendingImageUploads = ref([]);
const pendingImageDeletes = ref(new Set());
const eventImages = computed(() => [
  ...(event.value?.images ?? []).filter(
    (image) => !pendingImageDeletes.value.has(image.id),
  ),
  ...pendingImageUploads.value.map((pendingImage) => ({
    id: pendingImage.id,
    url: pendingImage.previewUrl,
    isPending: true,
  })),
]);
const activeImageIndex = ref(0);
const imageFileInput = ref(null);
const isSavingChanges = ref(false);
const imageUploadError = ref("");

function openImageFilePicker() {
  imageUploadError.value = "";
  imageFileInput.value?.click();
}

async function handleImageUpload(uploadEvent) {
  const input = uploadEvent.target;
  const file = input.files?.[0];
  if (!file) return;

  imageUploadError.value = "";
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    imageUploadError.value =
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.";
    input.value = "";
    return;
  }

  const maxFileSize = 5 * 1024 * 1024;
  if (file.size > maxFileSize) {
    imageUploadError.value = "File too large. Maximum size is 5 MB.";
    input.value = "";
    return;
  }

  pendingImageUploads.value.push({
    id: `pending-${Date.now()}-${Math.random()}`,
    file,
    previewUrl: URL.createObjectURL(file),
  });
  activeImageIndex.value = eventImages.value.length - 1;
  input.value = "";
}

function deleteCurrentImage() {
  const image = eventImages.value[activeImageIndex.value];
  if (!image || isSavingChanges.value) return;

  imageUploadError.value = "";
  if (image.isPending) {
    const pendingImage = pendingImageUploads.value.find(
      (pending) => pending.id === image.id,
    );
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    pendingImageUploads.value = pendingImageUploads.value.filter(
      (pending) => pending.id !== image.id,
    );
  } else {
    pendingImageDeletes.value = new Set([
      ...pendingImageDeletes.value,
      image.id,
    ]);
  }

  activeImageIndex.value = Math.max(
    0,
    Math.min(activeImageIndex.value, eventImages.value.length - 1),
  );
}

async function savePendingImageChanges() {
  for (const pendingImage of [...pendingImageUploads.value]) {
    const formData = new FormData();
    formData.append("file", pendingImage.file);

    const response = await $fetch(`/api/event/${eventId}/images`, {
      method: "POST",
      body: formData,
    });

    event.value.images ??= [];
    event.value.images.push(response.data);
    URL.revokeObjectURL(pendingImage.previewUrl);
    pendingImageUploads.value = pendingImageUploads.value.filter(
      (pending) => pending.id !== pendingImage.id,
    );
  }

  for (const imageId of [...pendingImageDeletes.value]) {
    await $fetch(
      `/api/event/${encodeURIComponent(eventId)}/images/${encodeURIComponent(imageId)}`,
      { method: "DELETE" },
    );

    event.value.images = event.value.images.filter(
      (image) => image.id !== imageId,
    );
    const remainingDeletes = new Set(pendingImageDeletes.value);
    remainingDeletes.delete(imageId);
    pendingImageDeletes.value = remainingDeletes;
  }

  activeImageIndex.value = Math.max(
    0,
    Math.min(activeImageIndex.value, eventImages.value.length - 1),
  );
}

function discardPendingImageChanges() {
  for (const pendingImage of pendingImageUploads.value) {
    URL.revokeObjectURL(pendingImage.previewUrl);
  }
  pendingImageUploads.value = [];
  pendingImageDeletes.value = new Set();
  activeImageIndex.value = Math.max(
    0,
    Math.min(activeImageIndex.value, eventImages.value.length - 1),
  );
}

function showPreviousImage() {
  activeImageIndex.value =
    (activeImageIndex.value - 1 + eventImages.value.length) %
    eventImages.value.length;
}

function showNextImage() {
  activeImageIndex.value =
    (activeImageIndex.value + 1) % eventImages.value.length;
}

// get local time string for edited events
function toLocalISOString(date) {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
  return localISOTime.slice(0, 16);

}

// Load and initialize
async function loadEvent() {
  try {
    const eventdata = await fetchCombinedEventById(eventId);
    event.value = eventdata;
    const startTime = new Date(eventdata.start);
    const endTime = new Date(eventdata.end);
    console.log(eventdata)

    Object.assign(editedEvent, {
      title: eventdata.title,
      description: eventdata.description,
      startTime: toLocalISOString(startTime),
      endTime: toLocalISOString(endTime),
      capacity: eventdata.capacity,
      location: eventdata.location,
      address: eventdata.address,
      eventLat: eventdata.lat,
      eventLong: eventdata.lng,
    });


    if (eventdata.signUps?.length) {
      const ids = new Set(eventdata.signUps.map((s) => s.userId));
      const res = await $fetch("/api/user");
      const users = res?.success ? res.Users : [];
      userMap.value = Object.fromEntries(
        users.filter((u) => ids.has(u.id)).map((u) => [u.id, u])
      );
    }

    isArchived.value = eventdata.isArchived

    const now = Date.now()
    isPastEvent.value = (now > endTime ? true : false);

    console.log(isPastEvent.value)

    //isAdmin.value =  (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER' ? true : false)

  } catch (e) {
    console.error("Load failed", e);
  } finally {
    console.log("Load complete. Edited event:", editedEvent)
    isLoading.value = false;
  }
}

onMounted(loadEvent);

// Actions
const toggleEdit = () => (isEditing.value = true);

async function saveChanges() {
    if (isSavingChanges.value) return;

    // Validation for location
    // if (!editedEvent.location || editedEvent.eventLat === null || editedEvent.eventLong === null) {
    //     alert("Please select a valid location on the map before submitting.");
    //     return;
    // }
    if (!editedEvent.location) {
        alert("Please enter a location for the event.");
        return;
    }

    // validation for time
    const startTime = new Date(editedEvent.startTime);
    const endTime = new Date(editedEvent.endTime);
    const currentTime = new Date();
    
    if (startTime < currentTime) {
      alert("Event start time cannot be in the past. Please select a future date and time.");
      return;
    }

    if (endTime <= startTime) {
      alert("Event end time must be after the start time.");
      return;
    }

    isSavingChanges.value = true;
    imageUploadError.value = "";
    try {
      // Apply event field changes before applying staged image changes.
      event.value.title = editedEvent.title;
      event.value.description = editedEvent.description;
      event.value.start = startTime.toISOString();
      event.value.end = endTime.toISOString();
      event.value.capacity = editedEvent.capacity;
      event.value.location = editedEvent.location;
      event.value.address = editedEvent.address;
      event.value.lat = editedEvent.eventLat;
      event.value.lng = editedEvent.eventLong;

    // puts changes in local database
    const { error : localPutError } = await useFetch(`../api/event/${eventId}`, {
        method: "PUT",
        body: event.value,
      });
      if (localPutError.value) {
        console.error("Local database PUT error:", localPutError.value);
        imageUploadError.value =
          "Could not save event changes. Image changes were not applied.";
        return;
      }

    // puts changes in google calendar
    const { error : googlePutError } = await useFetch(`../api/google/calendar/${eventId}`, {
          method: "PUT",
          body: event.value,
    });
      if (googlePutError.value) {
        console.error("Google database PUT error:", googlePutError.value);
      }

      await savePendingImageChanges();
      isEditing.value = false;
      emit("eventEdited", event.value);
    } catch (error) {
      console.error("Could not save event changes:", error);
      imageUploadError.value =
        error.data?.statusMessage ||
        error.data?.message ||
        error.message ||
        "Could not save all event changes. Please try again.";
    } finally {
      isSavingChanges.value = false;
    }
};

// reverts edits to what they were before
const cancelEdit = () => {
  discardPendingImageChanges();
  imageUploadError.value = "";

  // revert edits
  const startTime = new Date(event.value.start);
  const endTime = new Date(event.value.end);

  Object.assign(editedEvent, {
    title: event.value.title,
    description: event.value.description,
    startTime: toLocalISOString(startTime),
    endTime: toLocalISOString(endTime),
    capacity: event.value.capacity,
    location: event.value.location,
    address: event.value.address,
    eventLat: event.value.lat,
    eventLong: event.value.lng,
  });
  isEditing.value = false;
};


// deletes an event
async function deleteEvent() {

  // delete event on the database side
  const { error : localDeleteError } = await useFetch(`../api/event/${eventId}`, {
      method: "DELETE",
      body: event.value.id,
  });

  if (localDeleteError.value) {
    console.error("Local database DELETE error:", localDeleteError.value);
  }

  // delete event on the google calendar side
  const { error : googleDeleteError } = await useFetch(`../api/google/calendar/${eventId}`, {
      method: "DELETE",
      body: event.value.id,
  });

  if (googleDeleteError.value) {
    console.error("Google calendar DELETE error:", googleDeleteError.value);
  }

  console.log("Event deleted");
  emit("eventDeleted", event.value.id);
  emit("closeViewEventWindow");
  

};

// added in navigation to user profile function
const navigateToUserProfile = (userId) => {
  if (userId) {
    router.push(`/profile/${userId}`);
  }
};

// Formatting helper
function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const userRSVP = computed(() => {
  const userId = user?.id;
  if (!userId || !event.value?.signUps) return null;

  return event.value.signUps.some((s) => s.userId === userId) ? "yes" : "no";
});
const rsvpClickResponse = async (response) => {
  if(userRSVP.value === response){
    console.log('That option is already selected')
  }
  else{
    rsvpChoice.value = response;
  }
  return;
}

const respondToEvent = async (response) => {
  if (isResponding.value) return; // Prevent spamming by blocking clicks
  isResponding.value = true;

  if (!user.value || !user?.id) {
    //router.push("/login"); // Or use router.push("/") if using Vue Router directly
  }

  rsvpResponse.value = response;
  console.log(`User responded: ${response}`);

  const userId = user.id;
  const eventId = event.value?.id;

  if (!userId || !eventId) {
    console.error("Missing userId or eventId.");
    isResponding.value = false;
    return;
  }

  try {
    if (response === "yes") {
      const numPlusOneAdultsVal = numPlusOneAdults.value; // I created this var since js didn't like submitting numPlusOne.value in POST
      const numPlusOneKidsVal = numPlusOneKids.value;
      const result = await $fetch("/api/signup", {
        method: "POST",
        body: { userId, eventId, numPlusOneAdultsVal,numPlusOneKidsVal },
      });
      //console.log("Number of plus one's: ", numPlusOne.value)
      console.log("RSVP success:", result);
    } else if (response === "no") {
      console.log(userId);
      console.log(eventId);
      const signup = await $fetch("/api/signup/lookup", {
        method: "GET",
        query: { userId, eventId },
      });
      if (!signup || !signup.signUp.id) {
        console.warn("No RSVP found to remove.");
      } else {
        const result = await $fetch(`/api/signup/${signup.signUp.id}`, {
          method: "DELETE",
        });
        console.log("RSVP removed successfully:", result);
      }
    }
    rsvpChoice.value = '';
    await loadEvent();
  } catch (err) {
    const msg =
    err?.data?.error || //
    err?.data?.message || //
    (typeof err?.message === "string" ? err.message : "") ||"RSVP action failed."; // 

  rsvpError.value = msg;
  rsvpOk.value = "";
  console.error("RSVP action failed:", err);
  } finally {
    setTimeout(() => {
      isResponding.value = false;
    }, 1500);
  }
};
</script>
