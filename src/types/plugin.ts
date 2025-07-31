import {BaseParser} from "@/architectures/parser";
import {BaseEmulator} from "@/architectures/emulator";
import {BaseFormatter} from "@/architectures/formatter";
import {Generator} from "blockly";

export interface ArchitecturePlugin {
    name: string,
    fileExtension: string,
    parser: BaseParser,
    emulator: BaseEmulator,
    setupBlockBlocks: () => void,
    blocklyToolbox: any,
    blocklyGenerator: Generator,
    formatter: BaseFormatter,
}