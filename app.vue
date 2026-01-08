<template>
  <div class="bg-white"> <!-- forces light mode-->
    <!-- Safari Disclaimer Popup -->
    <div v-if="showSafariDisclaimer" class="fixed inset-0 z-50 flex items-center justify-center"
      @keydown.esc="closeSafariDisclaimer" tabindex="0" aria-modal="true" role="dialog">
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative border border-gray-200">
        <button @click="closeSafariDisclaimer" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center mb-3">
          <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="font-semibold text-lg">Safari Notice</span>
        </div>
        <p class="text-gray-700 mb-2">
          For the best experience, consider using Chrome or Firefox. Some features may not work as expected in Safari.
        </p>
        <button @click="closeSafariDisclaimer"
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Got it!
        </button>
      </div>
    </div>
    <!-- PWA Manifest and Route Announcer -->
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <div class="z-50 sticky bg-blue-600 text-white text-sm px-4 py-1">
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <!-- Left side: email with icon -->
        <div class="flex items-center gap-2 flex-grow">
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <a href="mailto:info@rainbowroundup.org" class="underline hover:text-blue-200">
              info@rrup.org
            </a>
          </div>
        </div>

        <!-- Right side: phone number -->
        <div class="shrink-0 pl-4">
          469-443-8993
        </div>
      </div>
    </div>

    <div class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="flex justify-between items-center px-4 py-2">
        <div class="flex items-center space-x-2">
          <a href="https://rrup.org/">
            <img src="/images/rrup_logo.png" alt="Rainbow Roundup Logo" class="h-12 w-auto"
              href="https://rrup.org/" />
          </a>
        </div>

        <!-- Navigation Links - added md sizing -->
        <nav class="hidden md:flex space-x-6 text-sm font-medium">
          <NuxtLink to="/" @click="navigate('Home')" class="text-gray-700 hover:text-black">Home</NuxtLink>
          <NuxtLink to="/aboutUs" @click="navigate('About Us')" class="text-gray-700 hover:text-black">About Us
          </NuxtLink>
          <NuxtLink to="/calendar" @click="navigate('Calendar')" class="text-gray-700 hover:text-black">Calendar
          </NuxtLink>
          <NuxtLink to="/merchandise" @click="navigate('Merchandise')" class="text-gray-700 hover:text-black">Merchandise
          </NuxtLink>
          <a class="text-gray-700 hover:text-black" href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE" @click="navigate('Donate')">Donate
          </a>
          <NuxtLink v-if="session?.data?.user?.id" to="/profile" @click="navigate('Profile')" class="text-gray-700 hover:text-black">Profile
          </NuxtLink>
          <NuxtLink v-if="!(session?.data?.user?.id)" to="/signup" @click="navigate('Sign Up')" class="text-gray-700 hover:text-black">
            Sign Up/Log In</NuxtLink>
          <button v-else @click="logout" class="text-gray-700 hover:text-black">
            Logout
          </button>
          <button @click="promptInstall" class="text-gray-700 hover:text-black">
            Install App
          </button>
          <!-- This is hidden if your browser does not support it, so I dont have to figure out a pretty way to write the error message-->
          <button @click="requestNotificationPermission();console.log('subscription: ',notifSubscription); showNotifError = true" v-if="($pwa?.getSWRegistration()?.pushManager)" 
            class="flex items-center  text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            aria-label="Toggle notifications">
            <span class="mr-2">Device notifications</span>
            <span v-if="isSubscribedToPush ">
              <!-- Bell icon -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </span>
            <span v-else>
              <!-- Bell with slash -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
              </svg>
            </span>
            
          </button>
        </nav>
        <!-- Hamburger Button - md: sizing -->
        <button @click="toggleMobileMenu"
          class="md:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-black focus:outline-none"
          aria-label="Toggle menu">
          <!-- Hamburger Icon -->
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!-- Close Icon -->
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Collapsible Mobile Navigation Menu (when page is resized)-->
      <div v-if="mobileMenuOpen"
        class="xl:hidden bg-white border-t border-gray-200 shadow-lg absolute left-0 right-0 top-full"
        style="z-index:100">
        <nav class="flex flex-col space-y-1 px-4 py-3 text-sm font-medium">
          <NuxtLink to="/" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click.native="handleMobileNavClick">Home</NuxtLink>
          <NuxtLink to="/aboutUs" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click.native="handleMobileNavClick">About Us</NuxtLink>
          <NuxtLink to="/calendar" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click.native="handleMobileNavClick">Calendar</NuxtLink>
            <NuxtLink to="/merchandise" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click.native="handleMobileNavClick">Merchandise</NuxtLink>
            
          <a href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
            class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click="handleMobileNavClick">Donate</a>
          <NuxtLink v-if="session?.data?.user?.id" to="/profile" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
          @click.native="handleMobileNavClick">Profile</NuxtLink>
          <NuxtLink v-if="(!session?.data?.user?.id)" to="/signup" class="block py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2"
            @click.native="handleMobileNavClick">
            Sign Up/Log In</NuxtLink>
          <button v-else @click="logout(); handleMobileNavClick()"
          class="block py-2 text-left text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2">Logout</button>
          
          <button @click="promptInstall(); handleMobileNavClick()"
            class="block py-2 text-left text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2">Install
            App</button>
          <button @click="requestNotificationPermission(); handleMobileNavClick()"
            class="flex items-center py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2 border-0"
            aria-label="Toggle notifications">
            <span class="mr-2">Device notifications</span>
            <span v-if="isSubscribedToPush">
              <!-- Bell icon -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </span>
            <span v-else>
              <!-- Bell with slash -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
              </svg>
            </span>
            <span>{{ notificationError }}</span>
          </button>
        </nav>
      </div>
      <span class="fixed box-border w-60 shadow-lg h-auto top-20 right-0 z-50 text-center items-center justify-center float-right bg-inherit rounded-lg p-1  border-gray-400 active:bg-gray-200 hover:bg-gray-200" v-if="showNotifError && notificationError.value" tabindex="0" aria-modal="true" role="dialog">
        <NuxtLink to="/login" @click="showNotifError = false">
          
        {{ notificationError }}
        </NuxtLink>
      </span>
    </div>
    <NuxtPage class="min-h-screen" />
  </div>
</template>

<script setup>
import { ref, onMounted} from "vue";
// Use the built-in auth composable instead of custom useUser
import { authClient } from "~/composables/auth"
const session = authClient.useSession()



const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const notificationPermission = ref(false);
const deferredPrompt = ref(null);
const runtimeConfig = useRuntimeConfig();
const notificationError = ref(null);
const isSubscribedToPush = ref(false);
const showNotifError = ref(false);
const { $pwa } = useNuxtApp();
const notifSubscription = ref(null)
// Toggles resized mobile menu view
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Closes the resized mobile menu once a nav link is clicked
const handleMobileNavClick = () => {
  mobileMenuOpen.value = false;
};

// Tracks if disclaimer has already been shown
const showSafariDisclaimer = ref(false);

// Safari detection function
const isSafari = () => {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  // Detect Safari (not Chrome, not Firefox, not Edge)
  return (
    /Safari/.test(ua) &&
    !/Chrome|Chromium|Edg|Firefox/.test(ua)
  );
};

// Close Safari disclaimer
const closeSafariDisclaimer = () => {
  showSafariDisclaimer.value = false;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("safariDisclaimerDismissed", "true");
  }
};

// Handle ESC key press
const handleKeyPress = (event) => {
  if (event.key === "Escape" && showSafariDisclaimer.value) {
    closeSafariDisclaimer();
  }
};

onMounted(() => {
  updateSubscriptionStatus();
  checkPushSubscription() // check push subscription on load
  window.addEventListener('focus', checkPushSubscription) // everytime the tab comes back in focus, reload it
  // Safari disclaimer logic
  if (
    typeof window !== "undefined" &&
    isSafari() &&
    sessionStorage.getItem("safariDisclaimerDismissed") !== "true"
  ) {
    showSafariDisclaimer.value = true;
    window.addEventListener("keydown", handleKeyPress); 
  }
});
// This is apparently needed to clean up the listener to prevent duplicates and other issues
onBeforeUnmount(() => {
  window.removeEventListener('focus', checkPushSubscription)
})


const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const promptInstall = async () => {
  const result = await $pwa.install() // Our PWA library can do PWA installation prompt
  console.log("Outcome of installation prompt: ",result.outcome)
};

const updateSubscriptionStatus = () => {
  notificationPermission.value = Notification.permission === "granted";
};


// This only checks is the client thinks it has subscribed to push
// If the subscription is deleted from our server, this value will not reflect that
// docs: https://developer.mozilla.org/en-US/docs/Web/API/PushManager/getSubscription
// Note: I did this with a function that updates on page load instead of computed because a lot of the calls made are not reactive and will not auto-update
async function checkPushSubscription() {
  if (!process.client) return
  if (!('serviceWorker' in navigator)) { // ensure browser support service workers
    notifSubscription.value = null
    isSubscribedToPush.value = false
    return
  }
  try {
    const sw = await navigator.serviceWorker.ready // wait for our service worker to be ready to prevent race conditions
    if (!sw?.pushManager) { // ensure browser support push manager
      notifSubscription.value = null
      isSubscribedToPush.value = false
      return
    }
    const subscription = await sw.pushManager.getSubscription()
    notifSubscription.value = subscription
    isSubscribedToPush.value = !!subscription && Notification.permission === 'granted'
  } catch (e) {
    // in any failure case, treat as not subscribed
    notifSubscription.value = null
    isSubscribedToPush.value = false
  }
}


notificationError.value = computed(() => {
  if (!($pwa?.getSWRegistration()?.pushManager)) {
    return "Not supported in your browser";
  }
  else {
    if(session?.value?.data?.user) {
      return null;
    }
    else {
      return "Login to register notifications";  
    }
  }
})
const requestNotificationPermission = () => {
  if ("serviceWorker" in navigator && "Notification" in window && session?.value?.data?.user?.id) {
    Notification.requestPermission()
      .then(async (permission) => {
        console.log("Permission:", permission);
        console.log("Does service worker exist: ", 'serviceWorker' in navigator);
        if (permission === "granted" && 'serviceWorker' in navigator) {
          notificationPermission.value = true;
          console.log("Both service worker and permission are good!");
          const applicationServerKey = runtimeConfig.public.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY;
          navigator.serviceWorker.ready.then(async (serviceWorkerRegistration) => {
            const options = {
              userVisibleOnly: true,
              applicationServerKey,
            };
            //console.log(serviceWorkerRegistration.getNotifications);
            serviceWorkerRegistration.pushManager.subscribe(options).then(
              async (pushSubscription) => {
                //console.log("Endpoint: ", pushSubscription.endpoint);
                const result = await $fetch("/api/notification/subscribe", {
                  method: "POST",
                  body: pushSubscription,
                });
                checkPushSubscription();
              },
              (error) => {
                console.error(error);
              },
            );
          });

        } else {
          notificationPermission.value = false;
          window("Could not subscribe to notifications, either permission was not granted or your browser doesn't support service workers");
        }
        notificationPermission.value = Notification.permission === "granted";
      })
  } else {
    console.warn("Notification API or Service Worker not supported.");
  }
};

const logout = async () => {
  await authClient.signOut();
  window.location.reload(true);
  //console.log("Implement logout")
};
const navigate = (section) => {
  // close mobile menu when navigating
  mobileMenuOpen.value = false;
  console.log(`Navigating to: ${section}`);
};
</script>