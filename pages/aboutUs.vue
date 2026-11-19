<template>
  <div class="min-h-screen bg-rr-offWhite text-gray-800 font-sans p-6 md:p-12">
    <header
      class="bg-rr-sky rounded-3xl shadow-lg text-center px-8 py-14 mb-12 text-black"
    >
      <h1 class="text-3xl font-extrabold mb-6">Rainbow Roundup</h1>
      <p class="max-w-md mx-auto text-md leading-relaxed font-medium">
        Rainbow Roundup is a non-profit organization that promotes acceptance in
        all aspects of lesbian, gay, bisexual and transgender families and
        allies, to serve and strengthen the community through social activities,
        education, and connecting resources to individuals.
      </p>
    </header>

    <div v-if="!isLoading" class="grid grid-cols-1 gap-10">
      <div v-if="isError">
        {{  errorMessage }}
      </div>
      <template v-else>
        <div
          v-for="person in people"
          :key="person.name"
          class="bg-white border-2 border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div
            class="flex items-center justify-between p-6 cursor-pointer"
            @click="toggleBio(person)"
          >
            <div class="flex items-center gap-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ person.name }}
                </h2>
                <p class="text-lg text-gray-600">{{ person.role }}</p>
              </div>
            </div>
            <button class="text-3xl text-rr-magenta focus:outline-none">
              {{ person.showBio ? "▲" : "▼" }}
            </button>
          </div>
          <transition name="fade">
            <div
              v-if="person.showBio"
              class="p-6 pt-0 text-lg text-gray-700 leading-relaxed"
            >
              {{ person.description }}
            </div>
          </transition>
        </div>
      </template>
    </div>
    <div v-else>
      Loading members...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Person {
  name: string;
  role: string;
  description: string;
  showBio: boolean;
}

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref("");

const people = ref<Person[]>([]);

// fetch team members
try {
  const { data: response } = await useFetch<{ data: Person[] }>(
    "/api/aboutUs/",
    { method: "GET" }
  );
  const members = response.value?.data ?? [];

  for (const member of members) {
    people.value.push({
      name: member.name,
      role: member.role,
      description: member.description,
      showBio: false
    });
  }
}
catch (error) {
    console.error("Could not fetch items: ", error);
    isError.value = true;
    errorMessage.value = "Could not fetch items: " + error;
}
finally
{
    isLoading.value = false;
}

//showBio toggles between the arrow state, it simply inverts it
const toggleBio = (person: Person) => {
  person.showBio = !person.showBio;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
