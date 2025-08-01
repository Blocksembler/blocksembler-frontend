import {BaseParser} from "@/architectures/parser";
import {AnnaInstructionFactory} from "@/architectures/anna/instructions";

export class AnnaAssemblyParser extends BaseParser {
    constructor() {
        super(new AnnaInstructionFactory(), "#", " ", ":");
    }

    isLabelReference(arg: string): boolean {
        return arg.startsWith('&')
    }

    labelReferenceToName(arg: string): string {
        return arg.slice(1);
    }

    labelToVal(labelAddress: number, instructionAddress: number): number {
        return labelAddress - instructionAddress - 1;
    }
}
