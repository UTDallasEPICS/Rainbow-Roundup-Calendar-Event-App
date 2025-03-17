<template>
  <div>
    <!-- PWA Manifest and Route Announcer -->
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />

    <div class="sticky top-0 z-50">
      <div
        class="flex justify-end bg-gray-100 py-2 items-center space-x-4 px-2"
      >
        <!-- Notification Button -->
        <button
          @click="requestNotificationPermission"
          class="p-2 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
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
        <button
          @click="toggleDropdown"
          class="px-4 py-2 text-md font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Menu
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
          <li v-if="status != 'authenticated'">
            <NuxtLink
              to="/signup"
              @click="navigate('Sign Up')"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
              >Sign Up</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/about"
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
            <NuxtLink
              to="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
            >
              Donate Here
            </NuxtLink>
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
    <NuxtPage />
  </div>
</template>

<script>
// Set up page metadata for authentication
// definePageMeta({
//   auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
// });

// const { signIn, signOut, status } = useAuth();
export default {
  data() {
    return {
      dropdownOpen: false,
      isSubscribed: false, // Track subscription status
      deferredPrompt: null,
    };
  },
  mounted() {
    // Check if the user is already subscribed (i.e., notification permission granted)
    this.updateSubscriptionStatus();
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  },
  methods: {
    // Toggle dropdown menu visibility
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },

    // Navigate to different pages (for now, just logs the page name)
    navigate(page) {
      console.log(`Navigating to ${page}`);
      this.dropdownOpen = false; // Close the dropdown after selection
    },

    promptInstall() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          this.deferredPrompt = null;
        });
      } else {
        console.log("Install prompt not available");
      }
    },

    updateSubscriptionStatus() {
      if (Notification.permission === "granted") {
        this.isSubscribed = true;
      } else {
        this.isSubscribed = false;
      }
    },

    requestNotificationPermission() {
      if ("serviceWorker" in navigator && "Notification" in window) {
        // Force the prompt if the permission is already granted
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              console.log("Notification permission granted");
              this.isSubscribed = true; // Set subscription status to true when permission is granted

              // Send a message to the service worker after permission is granted
              navigator.serviceWorker.ready
                .then((registration) => {
                  registration.active.postMessage({
                    action: "showMessage", // Action to display a message
                    message: "Notification permission granted!",
                  });
                })
                .catch((error) => {
                  console.error(
                    "Error sending permission status to service worker:",
                    error
                  );
                });
            } else if (permission === "denied") {
              console.log("Notification permission denied");
              this.isSubscribed = false; // Set subscription status to false when permission is denied
            }

            // Update subscription status after each request
            this.updateSubscriptionStatus();
          })
          .catch((error) => {
            console.error("Error requesting notification permission:", error);
          });
      } else {
        console.log("Notification API or Service Worker is not supported");
      }
    },
  },
};
</script>
