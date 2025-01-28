import {reactive, ref} from "vue";
import {ArmletEmulator} from "./architectures/armlet/system";
import {BlocksemblerSettings} from "./settings.js";
import {ArmletAssemblyParser} from "@/architectures/armlet/parser.js";
import {formatAssemblyCode} from "@/architectures/formatter.js";


class CodingWorkspaceState {
    constructor() {
        this.sourceCode = "";
        this.blockEditorCallbacks = [];
    }

    initWorkspace(sourceCode) {
        this.sourceCode = formatAssemblyCode(sourceCode);
        this.blockEditorCallbacks.forEach(callback => callback(this.sourceCode))
    }

    updateSourceCode(sourceCode) {
        this.sourceCode = sourceCode;
    }

    addBlockEditorRefreshCallback(callback) {
        this.blockEditorCallbacks.push(callback);
    }
}

export const codingWorkspaceState = reactive(new CodingWorkspaceState());

export const loadedAssemblyCode = ref("");
export const jsonWorkspace = ref({});

export const settings = reactive(new BlocksemblerSettings())

export const emulator = reactive(new ArmletEmulator());

export const codeParser = reactive(
    new ArmletAssemblyParser(emulator.getInstructionFactory())
);
