import {BaseFormatter} from "@/architectures/formatter";
import {setupBlocklyBlocks} from "@/architectures/simpleRISC/blocks";
import {toolbox} from "@/architectures/simpleRISC/toolbox";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system";
import {SimpleRISCGenerator} from "@/architectures/simpleRISC/generator";
import {SimpleRISCParser} from "@/architectures/simpleRISC/parser";
import {ArchitecturePlugin} from "@/types/plugin";

export default {
    name: "simpleRISC",
    fileExtension: "asm",
    parser: new SimpleRISCParser(),
    emulator: new SimpleRISCEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new SimpleRISCGenerator().generator,
    formatter: new BaseFormatter(5, 10),
} satisfies ArchitecturePlugin;