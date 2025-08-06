import {Block, CodeGenerator} from "blockly";
import {BaseBlocklyGenerator} from "@/architectures/generator";


export class InsperHackGenerator extends BaseBlocklyGenerator {
    constructor() {
        super("insperHack");
    }

    setupGenerator() {
        super.setupGenerator();

        this.generator.forBlock["addw"] = (_block: Block, _generator: CodeGenerator): string => {
            // TODO: Assemble javascript into the code variable.
            return "...";
        }
    }
}