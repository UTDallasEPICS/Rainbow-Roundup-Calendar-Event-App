<script lang="ts" setup>
definePageMeta({
  middleware: "sidebase-auth",
});

const { status, data, signOut } = useAuth();
</script>

<template>
  <div v-if="data">
    {{ data.user }}
    Hello {{ data.user?.email }}! Admin Page Only I am protected! You are
    currently {{ status }}.
    <button @click="() => signOut({ callbackUrl: '/login' })">
      Signout with redirect
    </button>

    <Calendar />
  </div>
  <div v-else>You are not logged in.</div>
</template>
