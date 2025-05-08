import {BaseFormatter} from "@/architectures/formatter.js";
import {setupBlocklyBlocks} from "@/architectures/scott/blocks.js";
import {ScottBlocklyGenerator} from "@/architectures/scott/generator.js";
import {ScottEmulator} from "@/architectures/scott/system.js";
import {ScottAssemblyParser} from "@/architectures/scott/parser.js";
import {toolbox} from "@/architectures/scott/toolbox.js";

export default {
    name: "scott",
    fileExtension: "asm",
    parser: new ScottAssemblyParser(),
    emulator: new ScottEmulator(),
    setupBlockBlocks: setupBlocklyBlocks,
    blocklyToolbox: toolbox,
    blocklyGenerator: new ScottBlocklyGenerator().generator,
    formatter: new BaseFormatter(5, 20, ':', '#')
}