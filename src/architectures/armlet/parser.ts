import {ArmletInstructionFactory} from "@/architectures/armlet/instructions.js";
import {BaseParser} from "@/architectures/parser";

export class ArmletAssemblyParser extends BaseParser {
    constructor() {
        super(new ArmletInstructionFactory(), "#", ",", ":");
    }
}
