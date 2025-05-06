import {BaseBlocklyGenerator, Order} from "@/architectures/generator.js";

const defaultInstruction = (mnemonic, g) => {
    return (block, _generator) => {
        const operand = g.valueToCode(block, "operand", Order.ATOMIC);
        return `${mnemonic} ${operand}`;
    }
}

const noneOperandInstruction = (mnemonic, _g) => {
    return (block, _generator) => {
        return mnemonic;
    }
}

export class SimpleRISCGenerator extends BaseBlocklyGenerator {
    constructor() {
        super('simpleRISC');
    }

    setupGenerator() {
        super.setupGenerator();

        this.generator.forBlock["start"] = (block, _generator) => {
            return "";
        };

        this.generator.forBlock["register"] = (block, _generator) => {
            const registerNr = block.getFieldValue("value");

            return [`$${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["immediate"] = (block, _generator) => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["noop"] = (block, _generator) => {
            return "NOOP";
        }

        this.generator.forBlock["halt"] = (block, _generator) => {
            return "HALT";
        }

        this.generator.forBlock["labelDef"] = (block, _generator) => {
            const label = block.getFieldValue("label");
            return `@${label}:`
        };

        this.generator.forBlock["label"] = (block, _generator) => {
            const label = block.getFieldValue("value");

            return [`>${label}`, Order.ATOMIC];
        };

        this.generator.forBlock["jump"] = (block, generator) => {
            const label = generator.valueToCode(block, "operand", Order.ATOMIC);
            return `JUMP ${label}`;
        }

        this.generator.forBlock["beq"] = (block, generator) => {
            const label = generator.valueToCode(block, "operand", Order.ATOMIC);
            return `BEQ ${label}`;
        }

        this.generator.forBlock["bgt"] = (block, generator) => {
            const label = generator.valueToCode(block, "operand", Order.ATOMIC);
            return `BGT ${label}`;
        }

        this.generator.forBlock["load"] = defaultInstruction("LOAD", this.generator);
        this.generator.forBlock["move"] = defaultInstruction("MOVE", this.generator);
        this.generator.forBlock["add"] = defaultInstruction("ADD", this.generator);
        this.generator.forBlock["sub"] = defaultInstruction("SUB", this.generator);
        this.generator.forBlock["and"] = defaultInstruction("AND", this.generator);
        this.generator.forBlock["or"] = defaultInstruction("OR", this.generator);
        this.generator.forBlock["xor"] = defaultInstruction("XOR", this.generator);
        this.generator.forBlock["not"] = noneOperandInstruction("NOT", this.generator);
        this.generator.forBlock["lshift"] = defaultInstruction("LSHIFT", this.generator);
        this.generator.forBlock["rshift"] = defaultInstruction("RSHIFT", this.generator);
        this.generator.forBlock["compare"] = defaultInstruction("COMPARE", this.generator);
    }
}