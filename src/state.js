import {reactive, ref} from "vue";
import {AnnaEmulator} from "./architectures/anna/system";
import {BaseAssemblerParser} from "./architectures/parser";

export const generatedCode = ref("");

export const emulator = reactive(new AnnaEmulator());

export const annaCodeParser = reactive(
    new BaseAssemblerParser(emulator.getInstructionFactory())
);
