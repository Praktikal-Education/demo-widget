<script setup lang="ts">
import { onMounted, ref } from "vue";

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = params.get("urlBase");

const settings = ref();
const answer = ref();

const submitAnswer = async () => {
  await fetch(`${urlBase}/api/widget/v1/answer?token=${token}`, {
    body: JSON.stringify({
      answer: answer.value,
      points: 10,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

onMounted(async () => {
  const data = await (
    await fetch(`${urlBase}/api/widget/v1/settings?token=${token}}`, {
      method: "GET",
    })
  ).json();

  settings.value = data;
});
</script>

<template>
  <div class="Game">
    <div>These are the settings loaded: {{ settings }}</div>
    <input type="text" v-model="answer" />
    <button @click="submitAnswer">Submit answer</button>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.Game {
  background-color: gray;
  width: 100vw;
  height: 100vh;
}
</style>
