import {BaseParser} from "@/architectures/parser.js";
import {ScottInstructionFactory} from "@/architectures/scott/instructions.js";

export class ScottAssemblyParser extends BaseParser {
    constructor() {
        super(new ScottInstructionFactory(), "#", ",", ":");
    }
}