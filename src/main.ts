import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Edit from "./components/Edit.vue";
import IndexVue from "./components/Index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/edit",
      component: Edit,
    },
    {
      path: "/",
      component: IndexVue,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
