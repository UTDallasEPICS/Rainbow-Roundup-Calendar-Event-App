<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button :disabled="!file" @click="uploadToS3">Uploaasdd</button>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt="Profile Picture"
      class="mt-4 w-32 h-32 rounded-full"
    />
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

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
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
