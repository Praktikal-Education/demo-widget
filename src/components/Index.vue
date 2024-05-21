<script setup lang="ts">
import { ref, watch } from "vue";

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = decodeURIComponent(params.get("urlBase"));

const settings = ref();
const answer = ref();
const state = ref();
const sharedState = ref();
const overview = ref();
const ownRole = ref();

const submitAnswer = async () => {
  await fetch(`${urlBase}/api/widget/v1/answer?token=${token}`, {
    body: JSON.stringify(answer.value),
    method: "POST",
  });
};

const submitState = async () => {
  await fetch(`${urlBase}/api/widget/v1/state?token= s${token}`, {
    body: JSON.stringify(state.value),
    method: "POST",
  });
};

const submitSharedState = async () => {
  await fetch(`${urlBase}/api/widget/v1/sharedState?token=${token}`, {
    body: JSON.stringify(sharedState.value),
    method: "POST",
  });
};

function postHeight() {
  window.parent.postMessage({ height: 300, token }, urlBase);
}

const loadOverview = async (newToken: string) => {
  overview.value = await (
    await fetch(`${urlBase}/api/widget/v1/overview?token=${newToken}`, {
      method: "GET",
    })
  ).json();
};

const loadSharedState = async (newToken: string) => {
  sharedState.value = await (
    await fetch(`${urlBase}/api/widget/v1/sharedState?token=${newToken}`, {
      method: "GET",
    })
  ).json();
};

const getMyRole = async (newToken: string) => {
  ownRole.value = await (
    await fetch(`${urlBase}/api/widget/v1/ownRole?token=${newToken}`, {
      method: "GET",
    })
  ).text();
};

watch(
  () => token,
  async (newToken) => {
    // Wait for the token
    if (newToken) {
      await getMyRole(newToken);

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

      loadSharedState(newToken);

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
  () => token,
  (newToken) => {
    if (newToken) {
      socket = new WebSocket(
        `${urlBase.replace("http", "ws")}/api/socket/widget?token=${newToken}`
      );
    }
  },
  { immediate: true }
);

// If teacher, subscribe to overview changes
watch(
  [ownRole, () => socket],
  ([newMyRole, newSocket]) => {
    if (newMyRole === "teacher" && newSocket) {
      newSocket.addEventListener("message", (message: MessageEvent) => {
        if (
          message.data &&
          JSON.parse(message.data).event === "OVERVIEW_CHANGED"
        ) {
          loadOverview(token!);
        }
      });
    }
  },
  {
    immediate: true,
  }
);

// Subscribe to shared state changes
watch(
  () => socket,
  (newSocket) => {
    if (newSocket) {
      newSocket.addEventListener("message", (message: MessageEvent) => {
        if (
          message.data &&
          JSON.parse(message.data).event === "SHARED_STATE_CHANGED"
        ) {
          loadSharedState(token!);
        }
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
    <!-- Role -->
    <div v-if="ownRole">My role is: {{ ownRole }}</div>
    <div v-else>This is not a slideshow, so there are no roles</div>

    <div>These are the settings loaded: {{ settings }}</div>

    <div>This is the previous answer:</div>
    <input type="text" v-model="answer" />
    <button @click="submitAnswer">Submit answer</button>

    <div>This is the current state: {{ state }}</div>
    <input type="text" v-model="state" />
    <button @click="submitState">Save state</button>

    <!-- Overview -->
    <div v-if="ownRole === 'teacher' && (overview ?? []).length">
      <p>As I am a teacher, I have the right to see all my students here:</p>
      <div v-for="{ state, answer, isCheckedIn, screenName } in overview">
        - {{ screenName }} {{ state }} {{ answer }}
        {{ isCheckedIn }}
      </div>
    </div>

    <!-- Shared state -->
    <div v-if="ownRole === 'teacher'">
      <p>As I am a teacher, I can change the shared state:</p>
      <input type="text" v-model="sharedState" />
      <button @click="submitSharedState">Submit shared state</button>
    </div>
    <div v-else-if="ownRole">
      <p>
        I am not a teacher, so I can see the shared state but can’t change it
      </p>
      <div>{{ sharedState }}</div>
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
