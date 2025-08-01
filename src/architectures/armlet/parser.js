import {ArmletInstructionFactory} from "@/architectures/armlet/instructions";
import {BaseParser} from "@/architectures/parser";

export class ArmletAssemblyParser extends BaseParser {
    constructor() {
        super(new ArmletInstructionFactory(), "#", ",", ":");
    }
}
