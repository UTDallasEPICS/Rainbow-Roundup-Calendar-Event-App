<template>
  <div class="space-y-6">
    <div
      v-for="event in events"
      :key="event.id"
      class="bg-white rounded-2xl shadow flex items-center p-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <!-- Wrap the event in a link -->
      <NuxtLink :to="`/event/${event.id}`" class="flex items-center w-full">
        <!-- left color block -->
        <div
          class="w-20 h-24 bg-amber-300 rounded-[10px] flex-shrink-0 mr-4"
        ></div>

        <!-- event info -->
        <div class="flex-1 text-left">
          <div class="text-xs text-indigo-500 font-normal">
            {{ formatDateAndTime(event.start).date }} •
            {{ formatDateAndTime(event.start).time }}
          </div>
          <div class="text-base text-slate-900 font-medium">
            {{ event.title }}
          </div>
          <div class="text-xs text-gray-500 font-normal">
            {{ event.location }}
          </div>
        </div>

        <!-- status badge -->
        <div
          class="w-7 h-7 bg-orange-100 rounded-md backdrop-blur-[3px] flex items-center justify-center"
        >
          <div
            class="w-3 h-3 rounded-full"
            :class="isPast(event.start) ? 'bg-red-400' : 'bg-gray-400'"
          ></div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventList",
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDateAndTime(isoString) {
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
    },
    isPast(iso) {
      const eventDate = new Date(iso);
      const now = new Date();
      return eventDate < now;
    },
  },
};
</script>
