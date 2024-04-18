<script setup lang="ts">
import { ref, watch } from "vue";

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

const loadOverview = async (newToken: string) => {
  const loadedOverview = await (
    await fetch(`${urlBase}/api/widget/v1/overview?token=${newToken}`, {
      method: "GET",
    })
  ).json();

  overview.value = loadedOverview;
};

watch(
  () => token,
  async (newToken) => {
    // Wait for the token
    if (newToken) {
      console.log(newToken);

      const loadedSettings = await (
        await fetch(`${urlBase}/api/widget/v1/settings?token=${newToken}`, {
          method: "GET",
        })
      ).json();
      settings.value = loadedSettings;

      const loadedState = await (
        await fetch(`${urlBase}/api/widget/v1/state?token=${newToken}`, {
          method: "GET",
        })
      ).json();
      state.value = loadedState;

      const loadedAnswer = await (
        await fetch(`${urlBase}/api/widget/v1/answer?token=${newToken}`, {
          method: "GET",
        })
      ).json();
      answer.value = loadedAnswer;

      loadOverview(newToken);
    }
  },
  { immediate: true }
);

let socket: any;

watch(
  // If the overview is loaded and is not undefined,
  // it means that the user has the right to see the overview,
  // so s/he can subscribe to follow the changes in the overview
  [overview, () => token],
  ([newOverview, newToken]) => {
    if (newOverview && newToken && !socket) {
      socket = new WebSocket(
        `${urlBase.replace("http", "ws")}/api/socket/widget?token=${newToken}`
      );
      socket.addEventListener("message", () => {
        loadOverview(newToken);
      });
    }
  },
  {
    immediate: true,
  }
);

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

    <div v-if="overview && (overview ?? []).length">
      If I am a teacher, I have the right to see all my students here:
      <div
        v-for="{
          // @TEMP
          state,
          answer,
          isCheckedIn,
          answererId,
          screenName,
        } in overview"
      >
        - {{ answererId }} {{ screenName }} {{ state }} {{ answer }}
        {{ isCheckedIn }}
      </div>
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
