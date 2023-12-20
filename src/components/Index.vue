<script setup lang="ts">
import { onMounted, ref } from "vue";

const settings = ref();

const token = new URL(window.location).searchParams.get("token");

onMounted(async () => {
  const data = await fetch(
    `http://localhost:8101/api/widget/v1/settings?${new URLSearchParams({
      token: token!,
    }).toString()}`
  );
  settings.value = (await data.json()).example;
});
</script>

<template>These are the settings loaded: {{ settings }}</template>
