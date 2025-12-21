<template>
    <ViewEvent @close-view-event-window="showEventWindow = false" 
    v-if="showEventWindow" :eventId="event.id" />
    <div class="w-full px-4 sm:px-6 lg:px-8 min-w-[250px]" @click= "showEventWindow=true" >
      
      <div class="flex flex-wrap gap-4 justify-center py-4">
        <div
          class="w-full 
          sm:w-64 
          md:w-60 
          lg:w-72 h-48 
          sm:h-52 relative bg-white rounded-[20px] 
          shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] 
          overflow-hidden p-4 
          flex flex-col justify-between"
        >
          <!-- Amber bar -->
          <div
            class="w-[90%] 
            h-16 
            bg-amber-300 
            rounded-[10px] 
            absolute top-[10px] 
            left-1/2 -translate-x-1/2"
          >
            <!-- Date square -->
            <div
              class="absolute left-[8px] 
              top-[8px] 
              w-11 h-11 
              bg-white/70 
              rounded-[10px] 
              backdrop-blur-[3px] 
              flex flex-col 
              items-center justify-center"
            >
              <span
                class="text-red-400 
                text-lg 
                font-bold uppercase leading-none"
                >{{ dateDay }}</span
              >
              <span
                class="text-red-400 
                text-[10px] 
                font-medium uppercase leading-3"
                >{{ dateMonth }}</span
              >
            </div>

            <!-- Save / unsave -->
            <!-- <button
              @click.stop.prevent="toggleSaved"
              class="absolute right-[8px] top-[8px] w-7 h-7 bg-white/70 rounded-md backdrop-blur-[3px] flex items-center justify-center"
            >
              <span v-if="!isSaved" class="text-red-400 text-lg font-bold"
                >+</span
              >
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button> -->

          </div>

          <!-- Content below the bar -->
          <div
            class="absolute 
            inset-x-0 top-0 
            flex flex-col 
            pt-[75px] 
            px-4 box-border"
          >
            <!-- Title -->
            <div class="text-black 
            text-base 
            sm:text-lg 
            font-medium mt-2">
              {{ event.title }}
            </div>

            <!-- Attendees -->
            <!-- <div class="flex items-center mt-2">
              <div class="flex -space-x-2">
                <img
                  v-for="(a, i) in avatars"
                  :key="i"
                  :src="a"
                  class="w-6 h-6 rounded-full outline outline-1 outline-offset-[-0.5px] outline-white"
                />
              </div>
              <span class="text-indigo-700 text-xs font-medium ml-2"
                >+{{ event.currentCapacity }} Going</span
              >
            </div> -->

            <!-- Location -->
            <!-- <div
              class="relative flex items-center text-indigo-950 text-xs mt-1"
            >
              <div class="w-4 h-4 mr-1 relative">
                <div
                  class="w-3 h-3 absolute left-[2px] top-[0.7px] bg-slate-500 outline outline-[1.5px] outline-offset-[-0.75px]"
                ></div>
                <div
                  class="w-1 h-1 absolute left-[6px] top-[4.7px] bg-white outline outline-[1.5px] outline-offset-[-0.75px]"
                ></div>
              </div>
              <span class="truncate max-w-[70%] sm:max-w-full">{{
                event.location
              }}</span>
            </div> -->
            
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Event, SignUp, User } from "@prisma/client";

// Extended type to include relations
type EventWithRelations = Event & {
  SignUps?: (SignUp & { User?: User | null })[];
};
const showEventWindow = ref(false);

const props = defineProps<{
  event: EventWithRelations;
  saved?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:saved", value: boolean): void;
  (e: "expand"): void;
}>();

// Date calculations

const dateDay = computed(() => {
  const date = new Date (props.event.startTime).getDate()
  return date
});
  
//console.log()

 const dateMonth = computed(() => {
   const month = new Date(props.event.startTime).getMonth();
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];
  return months[month];
});

// Avatars from sign ups (commented out for now)
// const avatars = computed(() => {
//   if (!props.event.SignUps) return [];
//   return props.event.SignUps
//     .map((s: any) => s.User?.profilePic)
//     .filter((url) => !!url);
// });

// Saved state
//const isSaved = ref(props.saved || false);

// watch(
//   () => props.saved,
//   (v) => {
//     isSaved.value = v || false;
//   }
// );

// function toggleSaved() {
//   isSaved.value = !isSaved.value;
//   emit("update:saved", isSaved.value);
// }
</script>