import {reactive} from "vue";
import {BlocksemblerSettings} from "@/settings.js";
import {pluginRegistry} from "@/architectures/pluginRegistry.js";
import {setupDefaultBlocks} from "@/architectures/blocks.js";

const defaultArchitecture = "scott";

class BlocksemblerState {
    constructor() {
        this.loadPlugin(defaultArchitecture);
        setupDefaultBlocks();

        this.sourceCode = "";
        this.onInitWorkspaceListener = [];
    }

    initWorkspace(sourceCode, architecture = defaultArchitecture) {
        this.loadPlugin(architecture);

        this.sourceCode = this.archPlugin.formatter.formatCode(sourceCode);
        this.onInitWorkspaceListener.forEach(callback => callback(this.sourceCode))
    }

    addOnInitWorkspaceListener(listener) {
        this.onInitWorkspaceListener.push(listener);
    }

    loadPlugin(pluginName) {
        this.archPlugin = pluginRegistry[pluginName];
        this.archPlugin.setupBlockBlocks();
    }
}


export const codingWorkspaceState = reactive(new BlocksemblerState());


export const settings = reactive(new BlocksemblerSettings())