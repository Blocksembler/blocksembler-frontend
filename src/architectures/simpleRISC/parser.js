import {BaseParser} from "@/architectures/parser.js";
import {SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";

export class SimpleRISCParser extends BaseParser {
    constructor() {
        super(new SimpleRISCInstructionFactory(), "#", ",", ":");
    }

    isLabelReference(arg) {
        return arg.startsWith('>')
    }

    labelReferenceToName(arg) {
        return `@${arg.slice(1)}`
    }

    labelToVal(labelAddress, instructionAddress) {
        return labelAddress - instructionAddress - 1;
    }
}
