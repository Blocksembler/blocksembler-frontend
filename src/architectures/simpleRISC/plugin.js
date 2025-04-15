import {BaseFormatter} from "@/architectures/formatter.js";
import {setupBlocklyBlocks} from "@/architectures/simpleRISC/blocks.js";
import {toolbox} from "@/architectures/simpleRISC/toolbox.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";
import {SimpleRISCGenerator} from "@/architectures/simpleRISC/generator.js";
import {SimpleRISCParser} from "@/architectures/simpleRISC/parser.js";

export default {
    name: "simpleRISC",
    parser: new SimpleRISCParser(),
    emulator: new SimpleRISCEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new SimpleRISCGenerator().generator,
    formatter: new BaseFormatter(5, 10),
}