import {reactive} from "vue";
import {BlocksemblerSettings} from "@/settings.js";
import {pluginRegistry} from "@/architectures/pluginRegistry.js";
import {setupDefaultBlocks} from "@/architectures/blocks.js";
import {logEvent} from "@/logging.js";

const architecturePluginKey = import.meta.env.VITE_BLOCKSEMBLER_DEFAULT_ARCHITECTURE !== undefined ?
    import.meta.env.VITE_BLOCKSEMBLER_DEFAULT_ARCHITECTURE : 'simpleRISC';

class BlocksemblerState {
    constructor() {
        console.log(architecturePluginKey);
        setupDefaultBlocks();

        this.archPlugin = this.loadPlugin(architecturePluginKey);
        this.sourceCode = "";
        this.onInitWorkspaceListener = [];
    }

    initWorkspace(sourceCode) {
        this.archPlugin = this.loadPlugin(architecturePluginKey);

        try {
            this.archPlugin.parser.parseCode(sourceCode);
            this.sourceCode = this.archPlugin.formatter.formatCode(sourceCode);
            this.onInitWorkspaceListener.forEach(callback => callback(this.sourceCode))
        } catch (e) {
            logEvent("failedToImportSourceCode", e);
            alert("Failed to import source file.")
        }
    }

    addOnInitWorkspaceListener(listener) {
        this.onInitWorkspaceListener.push(listener);
    }

    loadPlugin(pluginName) {
        if (!(pluginName in pluginRegistry)) {
            throw new Error(`architecture plugin "${pluginName}" not found`);
        }

        const archPlugin = pluginRegistry[pluginName];
        archPlugin.setupBlockBlocks();
        return archPlugin;
    }
}


export const codingWorkspaceState = reactive(new BlocksemblerState());


export const settings = reactive(new BlocksemblerSettings())