<template>
  <div class="bg-white min-h-screen">
    <!-- PWA Manifest and Route Announcer -->
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />

    <div class="sticky top-0 z-50">
      <div class="flex justify-end py-2 items-center space-x-4 px-2 bg-white">
        <!-- Notification Button -->
        <button
          @click="requestNotificationPermission"
          class="p-2 text-lg font-semibold text-gray-500 rounded-lg"
        >
          <span v-if="isSubscribed">
            <!-- Normal Bell Icon when Subscribed -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>
          </span>
          <span v-else>
            <!-- Bell Icon with Slash when Not Subscribed -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
              />
            </svg>
          </span>
        </button>

        <!-- Menu Button -->
        <!-- Hamburger Menu Button -->
        <button
          @click="toggleDropdown"
          class="p-3 rounded-lg"
          aria-label="Toggle menu"
        >
          <!-- Hamburger icon -->
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Dropdown Menu -->
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10"
      >
        <ul class="space-y-2 py-2">
          <li>
            <NuxtLink
              to="/"
              @click="navigate('Home')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >Home</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/aboutUs"
              @click="navigate('About Us')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >About Us</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/calendar"
              @click="navigate('Calendar')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >Calendar</NuxtLink
            >
          </li>
          <li>
            <a
              href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
              @click="navigate('Donate')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >Donate</a
            >
          </li>
          <li v-if="status === 'unauthenticated' || status === null">
            <NuxtLink
              to="/signup"
              @click="navigate('Sign Up')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >Sign Up</NuxtLink
            >
          </li>
          <li v-else>
            <button
              @click="() => signOut({ callbackUrl: '/login' })"
              class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
            >
              Logout
            </button>
          </li>
          <li
            @click="promptInstall"
            class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
          >
            Install App
          </li>
        </ul>
      </div>
    </div>

    <!-- Nuxt Page Component to display content -->
    <NuxtPage class="min-h-screen bg-white" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { status, signOut } = useAuth();

console.log(status.value);
const dropdownOpen = ref(false);
const isSubscribed = ref(false);
const deferredPrompt = ref(null);

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    console.log("Deferred prompt captured (composition API)");
  });
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const navigate = (page) => {
  console.log(`Navigating to ${page}`);
  dropdownOpen.value = false;
};

const promptInstall = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    deferredPrompt.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt.value = null;
    });
  } else {
    console.log("Install prompt not available");
  }
};

const updateSubscriptionStatus = () => {
  isSubscribed.value = Notification.permission === "granted";
};

const requestNotificationPermission = () => {
  if ("serviceWorker" in navigator && "Notification" in window) {
    Notification.requestPermission()
      .then((permission) => {
        console.log("Permission:", permission);
        if (permission === "granted") {
          isSubscribed.value = true;
          navigator.serviceWorker.ready.then((registration) => {
            if (registration.active) {
              registration.active.postMessage({
                action: "showMessage",
                message: "Notifications enabled!",
              });
            }
          });
        } else {
          isSubscribed.value = false;
        }
        updateSubscriptionStatus();
      })
      .catch((err) => {
        console.error("Notification permission error:", err);
      });
  } else {
    console.warn("Notification API or Service Worker not supported.");
  }
};

onMounted(() => {
  updateSubscriptionStatus();
});
</script>