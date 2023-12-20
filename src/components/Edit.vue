<script setup lang="ts">
import { onMounted, ref } from "vue";

const settings = ref();

const token = new URL(window.location).searchParams.get("token");

const submitSettings = () => {
  fetch("http://localhost:8101/api/widget/v1/settings", {
    body: JSON.stringify({
      data: {
        example: settings.value,
      },
      token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
};

onMounted(async () => {
  const data = await fetch(
    `http://localhost:8101/api/widget/v1/settings?${new URLSearchParams({
      token: token!,
    }).toString()}`
  );
  settings.value = (await data.json()).example;
});
</script>

<template>
  <label>You can edit the settings here:</label>
  <input type="text" v-model="settings" />
  <button @click="submitSettings">Submit</button>
</template>
