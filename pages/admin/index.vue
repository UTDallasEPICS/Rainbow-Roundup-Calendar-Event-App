<template>
  <div id="app">
    <header>
      <h1>Rainbow Roundup</h1>
      <p>
        Rainbow Roundup is a non-profit organization that promotes acceptance in all aspects of lesbian,
        gay, bisexual and transgender families and allies, to serve and strengthen the community through
        social activities, education, and connecting resources to individuals.
      </p>
    </header>
    <div class="bio-list">
      <div v-for="person in people" :key="person.name" class="bio-card">
        <div class="bio-header" @click="toggleBio(person)">
          <img :src="person.image" alt="Profile picture" class="profile-pic" />
          <div>
            <h2>{{ person.name }}</h2>
            <p>{{ person.title }}</p>
          </div>
          <button class="toggle-button">{{ person.showBio ? "\u25B2" : "\u25BC" }}</button>
        </div>
        <div v-if="person.showBio" class="bio-details">
          <p>{{ person.bio }}</p>
        </div>
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
#app {
  font-family: Arial, sans-serif;
  margin: 20px;
  color: black;
  background-color: #f0f0f0; 
}

header {
  text-align: center;
  margin-bottom: 20px;
  color: black;
  background-color: #e6e6e6; 
  padding: 20px;
}

.bio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f0f0; 
}

.bio-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
  color: black;
}

.bio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: black;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.toggle-button {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  color: black;
}

.bio-details {
  margin-top: 10px;
  color: black;
}
</style>

