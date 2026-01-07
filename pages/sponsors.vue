<template>
  <div class="sponsors-page">
    <!-- Hero Section -->
    <section class="hero h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <div class="content text-center max-w-3xl mx-auto">
        <h2 class="text-5xl font-extrabold text-gray-800">Our Sponsors</h2>
        <p class="text-gray-600 mt-6">
          We are so thankful to all of our supporters for their generosity.
        </p>
        <div class="flex justify-center">
          <button 
            @click="goToSponsorLink"
            class="mt-8 px-10 py-3 bg-gray-200 text-gray-800 text-lg font-semibold rounded-lg
                   shadow-md hover:bg-gray-300 hover:shadow-lg transform hover:-translate-y-1
                   transition-all duration-300 ease-in-out focus:outline-none focus:ring-2
                   focus:ring-gray-300 focus:ring-opacity-50"
          >
            Become a Sponsor
          </button>
        </div>
      </div>
    </section>
    
    <!-- Gold Sponsors -->
    <section class="sponsors py-16 flex flex-col items-center text-center">
      <h3 class="text-3xl font-bold text-gray-700 mb-10">Gold Sponsors</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-screen-lg mx-auto">
        <div v-for="(sponsor, index) in goldSponsors" :key="index" class="sponsor">
          <a :href="sponsor.link" target="_blank">
            <img
              :src="sponsor.image"
              :alt="sponsor.name"
              class="h-28 object-contain mx-auto"
            />
          </a>
        </div>
      </div>
    </section>

    <!-- Silver Sponsors -->
    <section class="silver-sponsors py-16 flex flex-col items-center text-center bg-gray-50">
      <h3 class="text-3xl font-bold text-gray-700 mb-10">Silver Sponsors</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 max-w-screen-lg mx-auto">
        <div v-for="(sponsor, index) in silverSponsors" :key="index" class="sponsor">
          <a :href="sponsor.link" target="_blank">
            <img
              :src="sponsor.image"
              :alt="sponsor.name"
              class="h-20 object-contain mx-auto"
            />
          </a>
        </div>
      </div>
    </section>

    <!-- Bronze Sponsors -->
    <section class="bronze-sponsors py-16 flex flex-col items-center text-center">
      <h3 class="text-3xl font-bold text-gray-700 mb-10">Bronze Sponsors</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-screen-lg mx-auto">
        <div v-for="(sponsor, index) in bronzeSponsors" :key="index" class="sponsor">
          <a :href="sponsor.link" target="_blank">
            <img
              :src="sponsor.image"
              :alt="sponsor.name"
              class="h-20 object-contain mx-auto"
            />
          </a>
        </div>
      </div>
    </section>

    <!-- Community Partners -->
    <section class="community-partners py-16 flex flex-col items-center text-center bg-gray-50">
      <h3 class="text-3xl font-bold text-gray-700 mb-10">Community Partners</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 max-w-screen-lg mx-auto">
        <div v-for="(partner, index) in communityPartners" :key="index" class="partner">
          <a :href="partner.link" target="_blank">
            <img
              :src="partner.image"
              :alt="partner.name"
              class="h-20 object-contain mx-auto"
            />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// made an interface
interface SponsorDetails {
  name: string;
  image: string;
  link: string;
}

//based off old sponsor link
const sponsorLink = ref("https://rrup.org/contact-us/");

//hard coded in, we would probably need a schema if we we wanted to add them instead of an interface
const goldSponsors = ref<SponsorDetails[]>([
  { 
    name: "Gold Sponsor 1", 
    image: "/images/gold1.png", 
    link: "https://www.dugganfamilylaw.com/" 
  },
  { 
    name: "Gold Sponsor 2", 
    image: "/images/gold2.png", 
    link: "https://burch-law.com/" 
  },
  { 
    name: "Gold Sponsor 3", 
    image: "/images/gold3.png", 
    link: "https://brookscannon.com/" 
  },
  { 
    name: "Gold Sponsor 4",
    image: "/images/gold4.png", 
    link: "https://teddybearparty.org/" 
  },
]);

const silverSponsors = ref<SponsorDetails[]>([
  { name: "Silver Sponsor 1", image: "/images/silver1.png", link: "https://theweteam.preproperties.com/" },
]);

const bronzeSponsors = ref<SponsorDetails[]>([
  { name: "Bronze Sponsor 1", image: "/images/bronze1.png", link: "https://www.kleinfertilitylaw.com/" },
  { name: "Bronze Sponsor 2", image: "/images/bronze2.png", link: "https://conceivefertilitycenter.com/" },
  { name: "Bronze Sponsor 3", image: "/images/bronze3.png", link: "https://www.mytruedental.com/" },
  { name: "Bronze Sponsor 4", image: "/images/bronze4.png", link: "https://www.debnamrust.com/" },
  { name: "Bronze Sponsor 5", image: "/images/bronze5.png", link: "https://www.joinampmd.com/" },
  { name: "Bronze Sponsor 6", image: "/images/bronze6.png", link: "https://www.fertilitytexas.com/" },
  { name: "Bronze Sponsor 7", image: "/images/bronze7.png", link: "https://www.edwardjones.com/us-en/financial-advisor/ashley-bloom" },
]);

const communityPartners = ref<SponsorDetails[]>([
  { name: "Community Partner", image: "/images/community1.png", link: "https://www.helpusadopt.org/" },
]);

//Opens up the sponsor's link, and doesn't add anything
const goToSponsorLink = () => {
  window.open(sponsorLink.value, "_blank");
};
</script>


<style scoped>
.sponsors-page {
  font-family: Arial, sans-serif;
  color: #333;
}

.hero {
  background-color: #f8f9fa;
}

button {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

button:hover {
  background-color: #d0d0d0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.sponsor img,
.partner img {
  transition: transform 0.3s ease;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sponsor img:hover,
.partner img:hover {
  transform: scale(1.1);
}
</style>
