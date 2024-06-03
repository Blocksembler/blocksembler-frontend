import {reactive, ref} from "vue";
import {AnnaEmulator} from "./architectures/anna/system";
import {BaseAssemblerParser} from "./architectures/parser";
import {BlocksemblerSettings} from "./settings.js";

export const generatedCode = ref("");
export const jsonWorkspace = ref({});

export const settings = reactive(new BlocksemblerSettings())

export const emulator = reactive(new AnnaEmulator());

export const annaCodeParser = reactive(
    new BaseAssemblerParser(emulator.getInstructionFactory())
);
