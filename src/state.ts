import {reactive} from "vue";
import {BlocksemblerSettings} from "@/settings";
import {pluginRegistry} from "@/architectures/pluginRegistry";
import {setupDefaultBlocks} from "@/architectures/blocks";
import {logEvent} from "@/logging";
import {ArchitecturePlugin} from "@/types/plugin";
import {WorkspaceListener} from "@/types/state";
import {UUIDTypes, v4 as uuidv4} from "uuid";
import {DEFAULT_ARCHITECTURE} from "@/config";

declare global {
    interface Window {
        env: Record<string, string>;
    }
}

const architecturePluginKey = DEFAULT_ARCHITECTURE;


class BlocksemblerState {
    archPlugin: ArchitecturePlugin;
    sourceCode: string;
    onInitWorkspaceListener: Array<WorkspaceListener>;
    uuid: UUIDTypes;

    constructor() {
        console.log(architecturePluginKey);
        setupDefaultBlocks();

        this.uuid = uuidv4();

        this.archPlugin = this.loadPlugin(architecturePluginKey);
        this.sourceCode = "";
        this.onInitWorkspaceListener = [];
    }

    initWorkspace(sourceCode: string): void {
        this.archPlugin = this.loadPlugin(architecturePluginKey);

        try {
            this.archPlugin.parser.parseCode(sourceCode);
            this.sourceCode = this.archPlugin.formatter.formatCode(sourceCode);
            this.onInitWorkspaceListener.forEach(callback => callback(this.sourceCode))
        } catch (e: any) {
            logEvent("failedToImportSourceCode", e);
            alert("Failed to import source file.")
            console.log(e);
        }
    }

    addOnInitWorkspaceListener(listener: WorkspaceListener) {
        this.onInitWorkspaceListener.push(listener);
    }

    loadPlugin(pluginName: string) {
        if (!(pluginName in pluginRegistry)) {
            throw new Error(`architecture plugin "${pluginName}" not found`);
        }

        const archPlugin = pluginRegistry[pluginName];
        archPlugin.setupBlocklyBlocks();
        return archPlugin;
    }
}


export const codingWorkspaceState = reactive(new BlocksemblerState());


export const settings = reactive(new BlocksemblerSettings())