import {ArmletEmulator} from "@/architectures/armlet/system.js";
import {setupBlocklyBlocks} from "@/architectures/armlet/blocks.js";
import {toolbox} from "@/architectures/armlet/toolbox.js";
import {ArmletBlocklyGenerator} from "@/architectures/armlet/generator.js";
import {ArmletAssemblyParser} from "@/architectures/armlet/parser.js";
import {ArmletInstructionFactory} from "@/architectures/armlet/instructions.js";
import {BaseFormatter} from "@/architectures/formatter.js";

const instructionFactory = new ArmletInstructionFactory();

export default {
    name: "armlet",
    parser: new ArmletAssemblyParser(instructionFactory),
    emulator: new ArmletEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new ArmletBlocklyGenerator().generator,
    formatter: new BaseFormatter(5, 20, ':', '#')
}