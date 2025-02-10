"use strict";

import {createApp} from "vue";
import App from "./App.vue";

import "./style.scss";

// noinspection ES6UnusedImports
import * as bootstrap from "bootstrap";
import {logEvent} from "@/logging.js";

window.onload = () => {
    logEvent('windowLoaded');
}

window.onbeforeunload = () => {
    logEvent('windowUnloaded');
}

createApp(App).mount("#app");
