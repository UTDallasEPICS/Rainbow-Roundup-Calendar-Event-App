<template>
  <div class="min-h-screen bg-rr-offWhite text-gray-800 font-sans p-6 md:p-12">
    <EditMember
      v-if="isMemberModalOpen"
      :member="selectedMember"
      @close-window="closeMemberModal()"
      @member-created="addMember"
      @member-updated="updateMember"
    />
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
        <div v-for="person in people" :key="person.id" class="flex items-start gap-3">
          <button
            type="button"
            class="mt-6 shrink-0 text-rr-magenta hover:text-rr-purple focus:outline-none"
            @click="openMemberModal(person)"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <div class="flex-1 bg-white border-2 border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
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
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="text-3xl text-rr-magenta focus:outline-none"
              >
                {{ person.showBio ? "▲" : "▼" }}
              </button>
            </div>
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
        </div>

        <button
          type="button"
          class="justify-self-center rounded-full bg-rr-magenta px-5 py-2 text-2xl font-bold text-white shadow hover:bg-rr-purple"
          @click="openAddMember()"
        >
          <span>+</span>
        </button>
      </template>
    </div>
    <div v-else>
      Loading members...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PencilIcon } from "@heroicons/vue/24/outline";

import { authClient } from "~/composables/auth"
const { data: session } = await authClient.getSession();
const userData = session?.user;

interface Person {
  id: string;
  name: string;
  role: string;
  description: string;
  showBio: boolean;
}

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref("");

const people = ref<Person[]>([]);

const selectedMember = ref<Omit<Person, 'showBio'> | null>(null);

const isMemberModalOpen = ref(false);

// fetch team members
try {
  const { data: response } = await useFetch<{ data: Person[] }>(
    "/api/aboutUs/",
    { method: "GET" }
  );
  const members = response.value?.data ?? [];

  for (const member of members) {
    people.value.push({
      id: member.id,
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

function openAddMember() {
  const newMember = {
      id: "",
      name: "",
      role: "",
      description: ""
    }

    selectedMember.value = newMember;

    
    isMemberModalOpen.value = true;
}

function openMemberModal(selected : Person) {
  selectedMember.value = {
    id: selected.id,
    name: selected.name,
    role: selected.role,
    description: selected.description
  };
  isMemberModalOpen.value = true;
}

function closeMemberModal() {
  isMemberModalOpen.value = false;
}

function addMember(newMember: Omit<Person, 'showBio'>) {

  const newMemberWithShowBio: Person = {
    ...newMember,
    showBio: false
  };

  people.value.push(newMemberWithShowBio);

  isMemberModalOpen.value = false;
}

function updateMember(updatedMember: Omit<Person, 'showBio'>) {
  const index = people.value.findIndex((person) => person.id === updatedMember.id);

  if (index !== -1) {
    people.value[index] = {
      ...people.value[index],
      ...updatedMember,
    };
  }

  isMemberModalOpen.value = false;
}
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
