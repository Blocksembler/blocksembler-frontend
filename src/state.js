import {reactive, ref} from "vue";
import {ArmletEmulator} from "./architectures/armlet/system";
import {BlocksemblerSettings} from "./settings.js";
import {ArmletAssemblyParser} from "@/architectures/armlet/parser.js";

export const generatedCode = ref("");
export const jsonWorkspace = ref({});

export const settings = reactive(new BlocksemblerSettings())

export const emulator = reactive(new ArmletEmulator());

export const codeParser = reactive(
    new ArmletAssemblyParser(emulator.getInstructionFactory())
);
