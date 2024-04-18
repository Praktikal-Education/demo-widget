<script setup lang="ts">
import { onMounted, ref } from "vue";

const settings = ref();
const image = ref();

const params = new URL(window.location).searchParams;
const token = params.get("token");
const urlBase = params.get("urlBase");

const submitSettings = () => {
  fetch(`${urlBase}/api/widget/v1/settings?token=${token}}`, {
    body: JSON.stringify(settings.value),
    method: "POST",
  });
};

const selectImage = (event) => {
  image.value = event?.target?.files[0];
};

const uploadImage = async () => {
  const uploadedImage: { src: string; width: number; height: number } = await (
    await fetch(`${urlBase}/api/widget/v1/image/add?token=${token}}`, {
      body: (() => {
        const body = new FormData();
        body.append("file", image.value);
        return body;
      })(),
      method: "POST",
    })
  ).json();

  console.log("Do with this url whatever you’d like to: ", uploadedImage.src);
};

onMounted(async () => {
  const data = await (
    await fetch(
      `${urlBase}/api/widget/v1/settings?token=${token}).toString()}`,
      { method: "GET" }
    )
  ).json();

  settings.value = data;
});
</script>

<template>
  <div>
    <label>You can edit the settings here:</label>
    <input type="text" v-model="settings" />
    <button @click="submitSettings">Submit</button>
  </div>

  <div>
    <label>Or add an image and use its url later on:</label>
    <input type="file" @change="selectImage" />
    <button @click="uploadImage">Upload</button>
  </div>
</template>
