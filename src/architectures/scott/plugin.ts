import {BaseFormatter} from "@/architectures/formatter";
import {setupBlocklyBlocks} from "@/architectures/scott/blocks";
import {ScottBlocklyGenerator} from "@/architectures/scott/generator";
import {ScottEmulator} from "@/architectures/scott/system";
import {ScottAssemblyParser} from "@/architectures/scott/parser";
import {toolbox} from "@/architectures/scott/toolbox";
import {ArchitecturePlugin} from "@/types/plugin";

export default {
    name: "scott",
    fileExtension: "asm",
    parser: new ScottAssemblyParser(),
    emulator: new ScottEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new ScottBlocklyGenerator().generator,
    formatter: new BaseFormatter(5, 20, ':', '#')
} satisfies ArchitecturePlugin;