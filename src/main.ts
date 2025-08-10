"use strict";

import {createApp} from "vue";
import App from "./App.vue";

import "./style.scss";

// noinspection ES6UnusedImports
import * as bootstrap from "bootstrap";
import {logEvent} from "@/logging";
import {codingWorkspaceState} from "@/state";

window.onload = () => {
    logEvent('windowLoaded', {sessionId: codingWorkspaceState.uuid});
}

window.onbeforeunload = () => {
    logEvent('windowUnloaded', {sessionId: codingWorkspaceState.uuid});
}

createApp(App).mount("#app");
