<template>
  <div class="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans p-6 md:p-12">
    <header
      class="bg-[#89BBEB] rounded-3xl shadow-lg text-center px-8 py-14 mb-12 text-black"
    >
      <h1 class="text-3xl font-extrabold mb-6">Rainbow Roundup</h1>
      <p class="max-w-md mx-auto text-md leading-relaxed font-medium">
        Rainbow Roundup is a non-profit organization that promotes acceptance in
        all aspects of lesbian, gay, bisexual and transgender families and
        allies, to serve and strengthen the community through social activities,
        education, and connecting resources to individuals.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-10">
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
            <img
              :src="person.image"
              alt="Profile picture"
              class="w-20 h-20 rounded-full object-cover border-4 border-[#89BBEB]"
            />
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ person.name }}
              </h2>
              <p class="text-lg text-gray-600">{{ person.title }}</p>
            </div>
          </div>
          <button class="text-3xl text-[#C028B9] focus:outline-none">
            {{ person.showBio ? "▲" : "▼" }}
          </button>
        </div>
        <transition name="fade">
          <div
            v-if="person.showBio"
            class="p-6 pt-0 text-lg text-gray-700 leading-relaxed"
          >
            {{ person.bio }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      people: [
        {
          name: "Kimberly Kantor",
          title: "Executive Director",
          bio: "Kimberly Kantor is an Adapted Physical Education Consultant for school districts across North Texas (Region X). Focusing on students with special needs in physical education and recreation, she dedicates time to helping students celebrate their accomplishments and showcase their athletic abilities.",
          image: "/images/kimberly.png",
          showBio: false,
        },
        {
          name: "Melody Smith",
          title: "President",
          bio: "Melody Smith has been an active leader in promoting LGBTQ+ inclusion and awareness in communities across the state.",
          image: "/images/melody.png",
          showBio: false,
        },
        {
          name: "Ashley",
          title: "Vice President",
          bio: "Hello All! My name is Ashley, I am married to the love of my life, Elsa and we have 3 beautiful kids. I am a Bachelor prepared RN of 16 years and am currently a Nurse Manager at Parkland Hospital in critical care services. My family and I love the mission and values of Rainbow Roundup and love all the memories we have made. ",
          image: "/images/ashley.png",
          showBio: false,
        },
        {
          name: "Ragan McCoy",
          title: "Treasurer",
          bio: "Ragan is a trusted tax advisor and leads Rainbow Roundup in all financial matters. She has a long history of providing guidance to businesses and individuals in making important decisions related to limiting tax exposure and maximizing cash flow.",
          image: "/images/ragan.png",
          showBio: false,
        },
        {
          name: "Laura Hogan",
          title: "Secretary",
          bio: "Laura is a trusted leader in the LGBT community and was named a Future Pioneer by the Dallas Voice. Since 2004, she has owned and operated Benchmark Legal Media, which provides creative and practical solutions for litigation technology. Laura has worked with many high profile clients, including Disney, Oprah Winfrey, GM, Viacom and MTV.",
          image: "/images/laura.png",
          showBio: false,
        },
      ],
    };
  },
  methods: {
    toggleBio(person) {
      person.showBio = !person.showBio;
    },
  },
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
