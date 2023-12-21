<script setup lang="ts">
import { onMounted, ref } from "vue";

const settings = ref();

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = params.get("urlBase");

onMounted(async () => {
  const data = await fetch(
    `${urlBase}/api/widget/v1/settings?${new URLSearchParams({
      token: token!,
    }).toString()}`
  );
  settings.value = (await data.json()).example;
});
</script>

<template>These are the settings loaded: {{ settings }}</template>
