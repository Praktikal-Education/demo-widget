<script setup lang="ts">
import { onMounted, ref } from "vue";

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = decodeURIComponent(params.get("urlBase"));

const settings = ref();
const answer = ref();
const state = ref();
const overview = ref();

const submitAnswer = async () => {
  await fetch(`${urlBase}/api/widget/v1/answer?token=${token}`, {
    body: JSON.stringify(answer.value),
    method: "POST",
  });
};

const submitState = async () => {
  await fetch(`${urlBase}/api/widget/v1/state?token=${token}`, {
    body: JSON.stringify(state.value),
    method: "POST",
  });
};

function postHeight() {
  window.parent.postMessage({ height: 300, token }, urlBase);
}

onMounted(async () => {
  console.log(urlBase);

  const loadedSettings = await (
    await fetch(`${urlBase}/api/widget/v1/settings?token=${token}`, {
      method: "GET",
    })
  ).json();

  settings.value = loadedSettings;

  const loadedState = await (
    await fetch(`${urlBase}/api/widget/v1/state?token=${token}`, {
      method: "GET",
    })
  ).json();

  state.value = loadedState;

  const loadedAnswer = await (
    await fetch(`${urlBase}/api/widget/v1/answer?token=${token}`, {
      method: "GET",
    })
  ).json();

  answer.value = loadedAnswer;

  console.log("usoetus");

  const loadedOverview = await (
    await fetch(`${urlBase}/api/widget/v1/overview?token=${token}`, {
      method: "GET",
    })
  ).json();

  overview.value = loadedOverview;

  postHeight(); // Feel free to send it whenever necessary
});

window.addEventListener("resize", postHeight); // Feel free to send it whenever necessary
</script>

<template>
  <div class="Game">
    <div>These are the settings loaded: {{ settings }}</div>

    <div>This is the previous answer:</div>
    <input type="text" v-model="answer" />
    <button @click="submitAnswer">Submit answer</button>

    <div>This is the current state: {{ state }}</div>
    <input type="text" v-model="state" />
    <button @click="submitState">Save state</button>

    <div v-if="overview">
      If I am a teacher, I have the right to see all my students here
      <div>{{ overview }}</div>
    </div>
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
