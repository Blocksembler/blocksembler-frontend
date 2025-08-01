import {BaseParser} from "@/architectures/parser";
import {ScottInstructionFactory} from "@/architectures/scott/instructions";

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