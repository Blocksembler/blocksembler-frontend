import {BaseParser} from "@/architectures/parser.js";
import {ScottInstructionFactory} from "@/architectures/scott/instructions.js";

export class ScottAssemblyParser extends BaseParser {
    constructor() {
        super(new ScottInstructionFactory(), "#", ",", ":", 8);
    }

    isLabelReference(arg) {
        return arg.startsWith('.')
    }

    labelReferenceToName(arg) {
        let label = arg.slice(1);
        return `.${label}`
    }
}