import {BaseFormatter} from "@/architectures/formatter.js";
import {setupBlocklyBlocks} from "@/architectures/simpleMips/blocks.js";
import {toolbox} from "@/architectures/simpleMips/toolbox.js";
import {BaseParser} from "@/architectures/parser.js";
import {SimpleMipsEmulator} from "@/architectures/simpleMips/system.js";
import {SimpleMipsGenerator} from "@/architectures/simpleMips/generator.js";
import {SimpleMipsInstructionFactory} from "@/architectures/simpleMips/instructions.js";

const factory = new SimpleMipsInstructionFactory()

export default {
    name: "simpleMips",
    parser: new BaseParser(factory, '#', ',', ':'),
    emulator: new SimpleMipsEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new SimpleMipsGenerator().generator,
    formatter: new BaseFormatter(5, 10),
}