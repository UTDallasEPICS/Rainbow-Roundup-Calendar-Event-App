<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button :disabled="!file" @click="uploadToS3">Uploaasdd</button>
    <img v-if="imageUrl" :src="imageUrl" alt="Profile Picture" class="mt-4 w-32 h-32 rounded-full" />
  </div>
  <button @click="subscribeToNotification" class="py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2">
    PLEASE SHOW UP</button>
  <button @click="requestNotificationPermission"
    class="py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2">Notifications?</button>
    <button @click="sendOrder"
    class="py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2">Send Test Order</button>
</template>

<script setup lang="ts">
const isSubscribed = ref(false);
const file = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const runtimeConfig = useRuntimeConfig();
//const { $pwa } = useNuxtApp();

//console.log($pwa);
//const service2 = $pwa?.getSWRegistration();

const requestNotificationPermission = async () => {
  if ("serviceWorker" in navigator && "Notification" in window) {
    Notification.requestPermission()
      .then(async (permission) => {
        console.log("Permission:", permission);
        console.log("Does service worker exist: ", 'serviceWorker' in navigator);
        if (permission === "granted" && 'serviceWorker' in navigator) {
          isSubscribed.value = true;

          const applicationServerKey = runtimeConfig.public.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY;
          navigator.serviceWorker.ready.then(async (serviceWorkerRegistration) => {
            const options = {
              userVisibleOnly: true,
              applicationServerKey,
            };
            console.log(serviceWorkerRegistration.getNotifications);
            serviceWorkerRegistration.pushManager.subscribe(options).then(
              async (pushSubscription) => {
                console.log("Endpoint: ", pushSubscription.endpoint);
                const result = await $fetch("/api/notification/subscribe", {
                  method: "POST",
                  body: pushSubscription,
                });
              },
              (error) => {
                console.error(error);
              },
            );
            const result = await $fetch("/api/notification/send", {
              method: "POST",
              body: {
                title: "Test notifination",
                data: { url: runtimeConfig.public.siteUrl },
              },
            });
          });

        } else {
          isSubscribed.value = false;
          console.log("Could not subscribe to notifications, either permission was not granted or your browser doesn't support service workers");
        }
        isSubscribed.value = Notification.permission === "granted";
      })
      .catch((err) => {
        console.error("Notification permission error:", err);
      });
  } else {
    console.warn("Notification API or Service Worker not supported.");
  }
};
const sendOrder = async() => {
  console.log("Order sending...")
  const orderItems=  [{itemVariantId: "1a9ea8f1-c03c-4534-abe6-693ce7a4c1bf"}] // Create an item with /api/item post and get an itemVariantId from db, this probably won't work for you
  const { error, data } = await $fetch("/api/order", {
    method: "POST",
    body: {
      status: "PENDING",
      orderItems: orderItems,
      orderType: "SHIPPING",
      shippingAddress: "r3egf4rwvc",
    },
  });
  console.log("Error: ", error)
  console.log('Data', data)

}
const subscribeToNotification = async () => {
  const { $pwa } = useNuxtApp();
  const registration = $pwa?.getSWRegistration(); // port this code to current stuff
  console.log("Registration: ", registration);
  if (!registration) {
    console.log("No valid service worker registration");
    return false;
  }
  try {
    const publicVapid = runtimeConfig.public.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY;
    const subscription = await registration.pushManager.subscribe();
    console.log("Subscription: ", subscription);
    if (!subscription) {
      console.log("No valid push subscription");
      return false;
    }
    const getAuthKey = () => {
      const json = subscription.toJSON();
      const authKey = json.keys?.auth;
      return typeof authKey === "string" ? authKey : "";
    };
    const authKey = getAuthKey();
    if (!authKey) {
      console.log("No valid auth keys");
      return false;
    }
    const result = await $fetch("/api/notification/subscribe", {
      method: "POST",
      body: subscription,
    });

    console.log(result);
    return result;
  } catch (err) {
    console.error("Error submitting signup form", err);
    //errors.value = { error: "Something went wrong during signup." };
  }
};
function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    file.value = input.files[0];
    console.log("File selected:", file.value.name); // Add this
  }
}

async function uploadToS3() {
  if (!file.value) return;

  const { uploadUrl, fileUrl } = await $fetch("/api/user/profile_picture", {
    method: "POST",
    body: {
      fileName: `${Date.now()}-${file.value.name}`,
      fileType: file.value.type,
    },
  });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.value.type,
    },
    body: file.value,
  });

  console.log(res);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", res.status, errorText);
  }

  imageUrl.value = fileUrl;
}
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replaceAll("-", "+")
    .replaceAll("_", "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
