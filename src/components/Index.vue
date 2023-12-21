<script setup lang="ts">
import { onMounted, ref } from "vue";

const settings = ref();

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = params.get("urlBase");

onMounted(async () => {
  const data = await (
    await fetch(
      `${urlBase}/api/widget/v1/settings?${new URLSearchParams({
        token: token!,
      }).toString()}`,
      { method: "GET" }
    )
  ).json();

  settings.value = data;
});
</script>

<template>These are the settings loaded: {{ settings }}</template>
