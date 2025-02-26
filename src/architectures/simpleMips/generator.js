import {BaseBlocklyGenerator, Order} from "@/architectures/generator.js";

const defaultInstruction = (mnemonic, g) => {
    return (block, _generator) => {
        const operand = g.valueToCode(block, "operand", Order.ATOMIC);
        return `${mnemonic} ${operand}`;
    }
}

export class SimpleMipsGenerator extends BaseBlocklyGenerator {
    constructor() {
        super('simpleMIPS');
    }

    setupGenerator() {
        super.setupGenerator();

        this.generator.forBlock["start"] = (block, _generator) => {
            return "";
        };

        this.generator.forBlock["register"] = (block, _generator) => {
            const registerNr = block.getFieldValue("value");

            return [`R${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["decImmediate"] = (block, _generator) => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["noop"] = (block, _generator) => {
            return "NOOP";
        }

        this.generator.forBlock["halt"] = (block, _generator) => {
            return "HALT";
        }

        this.generator.forBlock["load"] = defaultInstruction("LOAD", this.generator);
        this.generator.forBlock["move"] = defaultInstruction("MOVE", this.generator);
        this.generator.forBlock["add"] = defaultInstruction("ADD", this.generator);
        this.generator.forBlock["sub"] = defaultInstruction("SUB", this.generator);

    }
}