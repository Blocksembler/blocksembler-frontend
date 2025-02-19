import {BaseParser} from "@/architectures/parser.js";
import {AnnaInstructionFactory} from "@/architectures/anna/instructions.js";

export class AnnaAssemblyParser extends BaseParser {
    constructor() {
        super(new AnnaInstructionFactory(), "#", " ", ":");
    }

    isLabelReference(arg) {
        return arg.startsWith('&')
    }

    labelReferenceToName(arg) {
        return arg.slice(1);
    }

    labelToVal(labelAddress, instructionAddress) {
        return labelAddress - instructionAddress - 1;
    }
}
