import {reactive} from "vue";
import {BlocksemblerSettings} from "@/settings.js";
import {pluginRegistry} from "@/architectures/pluginRegistry.js";
import {setupDefaultBlocks} from "@/architectures/blocks.js";

const defaultArchitecture = "armlet";

class BlocksemblerState {
    constructor() {
        this.loadPlugin(defaultArchitecture);
        setupDefaultBlocks();

        this.sourceCode = "";
        this.onInitWorkspaceListener = [];
    }

    initWorkspace(sourceCode, architecture = defaultArchitecture) {
        this.loadPlugin(architecture);

        try {
            this.archPlugin.parser.parseCode(sourceCode);
            this.sourceCode = this.archPlugin.formatter.formatCode(sourceCode);
            this.onInitWorkspaceListener.forEach(callback => callback(this.sourceCode))
        } catch (e) {
            alert("Failed to import source file.")
        }
    }

    addOnInitWorkspaceListener(listener) {
        this.onInitWorkspaceListener.push(listener);
    }

    loadPlugin(pluginName) {
        if (pluginName in pluginRegistry) {
            this.archPlugin = pluginRegistry[pluginName];
            this.archPlugin.setupBlockBlocks();
        } else {
            throw new Error(`architecture plugin "${pluginName}" not found`);
        }
    }
}


export const codingWorkspaceState = reactive(new BlocksemblerState());


export const settings = reactive(new BlocksemblerSettings())