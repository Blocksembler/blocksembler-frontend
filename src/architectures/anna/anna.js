import {AnnaEmulator} from "@/architectures/anna/system.js";
import {setupBlocklyBlocks} from "@/architectures/anna/blocks.js";
import {toolbox} from "@/architectures/anna/toolbox.js";
import {AnnaBlocklyGenerator} from "@/architectures/anna/generator.js";
import {AnnaAssemblyParser} from "@/architectures/anna/parser.js";

export default {
    name: "anna",
    parser: new AnnaAssemblyParser(),
    emulator: new AnnaEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new AnnaBlocklyGenerator().generator,
}