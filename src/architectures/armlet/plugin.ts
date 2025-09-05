import {ArmletEmulator} from "@/architectures/armlet/emulator";
import {setupBlocklyBlocks} from "@/architectures/armlet/blocks";
import {toolbox} from "@/architectures/armlet/toolbox";
import {ArmletBlocklyGenerator} from "@/architectures/armlet/generator";
import {ArmletAssemblyParser} from "@/architectures/armlet/parser";
import {BaseFormatter} from "@/architectures/formatter";
import {ArchitecturePlugin} from "@/types/plugin";

export default {
    name: "armlet",
    fileExtension: "s",
    parser: new ArmletAssemblyParser(),
    emulator: new ArmletEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new ArmletBlocklyGenerator().generator,
    formatter: new BaseFormatter(5, 20, ':', '#')
} satisfies ArchitecturePlugin