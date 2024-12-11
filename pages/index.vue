<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <button
      @click="promptInstall"
      class="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >
      Install App
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deferredPrompt: null
    };
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  },
  methods: {
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
    }
  }
};
</script>