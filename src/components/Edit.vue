<script setup lang="ts">
import { onMounted, ref } from "vue";

const exampleData = ref();

const token = new URL(window.location).searchParams.get("token");

const submitSettings = () => {
  fetch("http://localhost:8101/api/widget/settings", {
    body: JSON.stringify({
      data: {
        example: exampleData.value,
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
    `http://localhost:8101/api/widget/settings?${new URLSearchParams({
      token: token!,
    }).toString()}`
  );
  exampleData.value = (await data.json()).example;
});
</script>

<template>
  <input type="text" v-model="exampleData" />
  <button @click="submitSettings">Submit</button>
</template>
