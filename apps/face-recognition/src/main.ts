import { createApp } from "vue";
import App from "./App.vue";
import VConsole from "vconsole";

import "./assets/main.css";

import "virtual:uno.css";

new VConsole();

createApp(App).mount("#app");
