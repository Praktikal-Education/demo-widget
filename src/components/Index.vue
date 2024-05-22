<script setup lang="ts">
import { ref, watch } from "vue";

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = decodeURIComponent(params.get("urlBase"));

const settings = ref();
const answer = ref();
const state = ref();
const ownRole = ref();

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

watch(
  () => token,
  async (newToken) => {
    // Wait for the token
    if (newToken) {
      // Check role
      ownRole.value = await (
        await fetch(`${urlBase}/api/widget/v1/ownRole?token=${newToken}`, {
          method: "GET",
        })
      ).text();

      // Settings
      settings.value = await (
        await fetch(`${urlBase}/api/widget/v1/settings?token=${newToken}`, {
          method: "GET",
        })
      ).json();

      // State
      state.value = await (
        await fetch(`${urlBase}/api/widget/v1/state?token=${newToken}`, {
          method: "GET",
        })
      ).json();

      // Previous answer
      answer.value = await (
        await fetch(`${urlBase}/api/widget/v1/answer?token=${newToken}`, {
          method: "GET",
        })
      ).json();
    }
  },
  { immediate: true }
);

// Init socket

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

// If teacher, load overview and subscribe to its changes

const overview = ref([]);

const loadOverview = async (newToken: string) => {
  const response = await (
    await fetch(`${urlBase}/api/widget/v1/overview?token=${newToken}`, {
      method: "GET",
    })
  ).json();

  if (!response.statusCode) {
    overview.value = response;
  }
};

watch(
  ownRole,
  (newOwnRole) => {
    if (newOwnRole === "teacher") loadOverview(token!);
  },
  { immediate: true }
);

watch(
  [ownRole, () => socket],
  ([newOwnRole, newSocket]) => {
    if (newOwnRole === "teacher" && newSocket) {
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

// Shared state

const sharedState = ref();

const loadSharedState = async (newToken: string) => {
  sharedState.value = await (
    await fetch(`${urlBase}/api/widget/v1/sharedState?token=${newToken}`, {
      method: "GET",
    })
  ).json();
};

watch(
  () => token,
  (newToken) => {
    if (newToken) loadSharedState(newToken);
  },
  { immediate: true }
);

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

const submitSharedState = async () => {
  await fetch(`${urlBase}/api/widget/v1/sharedState?token=${token}`, {
    body: JSON.stringify(sharedState.value),
    method: "POST",
  });
};

// Resizing

function postHeight() {
  window.parent.postMessage({ height: 300, token }, urlBase);
}

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
    <div v-if="overview.length">
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
