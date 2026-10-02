<template>
    <div
      :class="['rounded-2xl shadow flex items-center cursor-pointer hover:bg-gray-50 transition p-4', props.focusedEventId === props.event.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white']"
    >
      <div @click="handleClick(props.event.id)" class="flex items-center w-full">

        <!-- props.event info -->
        <div class="flex-1 text-left">
          <div class="text-xs text-indigo-500 font-normal">
            {{ formatDateAndTime(props.event.startTime).date }} •
            {{ formatDateAndTime(props.event.startTime).time }}
          </div>
          <div class="text-base text-slate-900 font-medium">
            {{ props.event.title }}
          </div>
          <div class="text-xs text-gray-500 font-normal">
            {{ props.event.location }}
          </div>
        </div>

        <!-- status badge -->
        <div
          class="w-7 h-7 bg-transparent rounded-md backdrop-blur-[3px] flex items-center justify-center"
        >
          <div
            class="w-3 h-3 rounded-full"
            :class="props.event?.isArchived ? 'bg-red-300' : 'bg-green-300'"
          ></div>
        </div>
      </div>
    </div>
</template>

<script setup>

    const props = defineProps(['event', 'focusedEventId', 'action']);
    const emit = defineEmits(['event-focused', 'event-view'])

    function formatDateAndTime(isoString) {
        if (!isoString) return { date: "", time: "" };

        const dateObj = new Date(isoString);

        const dateOptions = { month: "short", day: "numeric", year: "numeric" };
        const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions);

        const hour = dateObj.getHours();
        const minute = dateObj.getMinutes();
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedTime = `${formattedHour}:${minute
            .toString()
            .padStart(2, "0")} ${ampm}`;

        return { date: formattedDate, time: formattedTime };
    }

    function handleClick(id) {
        if (props.action == "focus") {
          emit("event-focused", id)
        }
        else {
          emit("event-view", id)
        }
    }

</script>