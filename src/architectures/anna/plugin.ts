import {AnnaEmulator} from "@/architectures/anna/emulator";
import {setupBlocklyBlocks} from "@/architectures/anna/blocks";
import {toolbox} from "@/architectures/anna/toolbox";
import {AnnaBlocklyGenerator} from "@/architectures/anna/generator";
import {AnnaAssemblyParser} from "@/architectures/anna/parser";
import {AnnaCodeFormatter} from "@/architectures/anna/formatter";
import {ArchitecturePlugin} from "@/types/plugin";

export default {
    name: "anna",
    fileExtension: "ac",
    parser: new AnnaAssemblyParser(),
    emulator: new AnnaEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new AnnaBlocklyGenerator().generator,
    formatter: new AnnaCodeFormatter()
} satisfies ArchitecturePlugin;