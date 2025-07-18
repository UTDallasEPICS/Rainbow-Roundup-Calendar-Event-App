<template>
  <div>
    <!-- PWA Manifest and Route Announcer -->
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <div class="bg-blue-600 text-white text-sm px-4 py-1">
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          Contact us at:
          <a
            href="mailto:info@rainbowroundup.org"
            class="underline hover:text-blue-200"
            >info@rrup.org</a
          >
        </div>
        469-443-8993
      </div>
    </div>

    <div class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="flex justify-between items-center px-4 py-2">
        <div class="flex items-center space-x-2">
          <img
            src="/public/images/rrup_logo.png"
            alt="Rainbow Roundup Logo"
            class="h-12 w-auto"
          />
        </div>

        <!-- Navigation Links -->
        <nav class="flex space-x-6 text-sm font-medium">
          <NuxtLink
            to="/"
            @click="navigate('Home')"
            class="text-gray-700 hover:text-black"
            >Home</NuxtLink
          >
          <NuxtLink
            to="/aboutUs"
            @click="navigate('About Us')"
            class="text-gray-700 hover:text-black"
            >About Us</NuxtLink
          >
          <NuxtLink
            to="/calendar"
            @click="navigate('Calendar')"
            class="text-gray-700 hover:text-black"
            >Calendar</NuxtLink
          >
          <a
            href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
            @click="navigate('Donate')"
            class="text-gray-700 hover:text-black"
            >Donate</a
          >
          <NuxtLink
            v-if="!session"
            to="/signup"
            @click="navigate('Sign Up')"
            class="text-gray-700 hover:text-black"
            >Sign Up/Log In</NuxtLink
          >
          <button v-else @click="logout" class="text-gray-700 hover:text-black">
            Logout
          </button>
          <button @click="promptInstall" class="text-gray-700 hover:text-black">
            Install App
          </button>
          <button
            @click="requestNotificationPermission"
            class="text-gray-700 hover:text-black"
            aria-label="Toggle notifications"
          >
            <span v-if="isSubscribed">
              <!-- Bell icon -->
              <svg
                class="w-5 h-5 inline"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </span>
            <span v-else>
              <!-- Bell with slash -->
              <svg
                class="w-5 h-5 inline"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                />
              </svg>
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Nuxt Page Component to display content -->
    <NuxtPage class="min-h-screen bg-white" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Use the built-in auth composable instead of custom useUser
const { data: session, signOut } = useAuth();

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
const logout = async () => {
  await signOut({ callbackUrl: "/" });
};
</script>
