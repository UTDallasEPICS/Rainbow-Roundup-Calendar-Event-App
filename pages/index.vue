<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <!-- Install App Button -->
      <button
        @click="promptInstall"
        class="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out mb-4"
      >
        Install App
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        deferredPrompt: null,
      };
    },
    mounted() {
      // Listen for beforeinstallprompt event to handle PWA install
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
      });
    },
    methods: {
      // Handle PWA install prompt
      promptInstall() {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            this.deferredPrompt = null;
          });
        } else {
          console.log('Install prompt not available');
        }
      },
    },
  };
  </script>
  