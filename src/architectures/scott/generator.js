import {BaseBlocklyGenerator, Order} from "@/architectures/generator.js";

const binaryOperatorGenerator = (mnemonic, g) => {
    return (block, _generator) => {
        const ra = g.valueToCode(block, "RA", Order.ATOMIC);
        const rb = g.valueToCode(block, "RB", Order.ATOMIC);

        return `${mnemonic} ${ra}, ${rb}`;
    }
}

export class ScottBlocklyGenerator extends BaseBlocklyGenerator {
    constructor() {
        super("scott");
    }

    setupGenerator() {
        super.setupGenerator();

        this.generator.forBlock["start"] = (block, _generator) => {
            return "";
        };

        this.generator.forBlock["labelDef"] = (block, _generator) => {
            const label = block.getFieldValue("label");
            return `.${label}:`;
        };

        this.generator.forBlock["register"] = (block, _generator) => {
            const registerNr = block.getFieldValue("value");

            return [`R${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["label"] = (block, _generator) => {
            const label = block.getFieldValue("value");

            return [`.${label}`, Order.ATOMIC];
        };

        this.generator.forBlock["decImmediate"] = (block, _generator) => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["clf"] = (block, _generator) => {
            return `CLF`
        }

        this.generator.forBlock["add"] = binaryOperatorGenerator("ADD", this.generator);
        this.generator.forBlock["shr"] = binaryOperatorGenerator("SHR", this.generator);
        this.generator.forBlock["shl"] = binaryOperatorGenerator("SHL", this.generator);
        this.generator.forBlock["not"] = binaryOperatorGenerator("NOT", this.generator);
        this.generator.forBlock["and"] = binaryOperatorGenerator("AND", this.generator);
        this.generator.forBlock["or"] = binaryOperatorGenerator("OR", this.generator);
        this.generator.forBlock["xor"] = binaryOperatorGenerator("XOR", this.generator);
        this.generator.forBlock["cmp"] = binaryOperatorGenerator("CMP", this.generator);

        this.generator.forBlock["jmp"] = (block, _generator) => {
            const target = this.generator.valueToCode(block, "target", Order.ATOMIC);

            if (target.startsWith("R")) {
                return `JMPR ${target}`;
            }
            return `JMP ${target}`;
        };

        this.generator.forBlock["jcaez"] = (block, _generator) => {
            const target = this.generator.valueToCode(block, "target", Order.ATOMIC);

            let mnemonic = "J";

            if (block.getFieldValue("C") === "TRUE") {
                mnemonic += "C";
            }

            if (block.getFieldValue("A") === "TRUE") {
                mnemonic += "A";
            }

            if (block.getFieldValue("E") === "TRUE") {
                mnemonic += "E";
            }

            if (block.getFieldValue("Z") === "TRUE") {
                mnemonic += "Z";
            }

            if (mnemonic === "j") {
                mnemonic = "JMP";
            }

            return `${mnemonic} ${target}`;
        };

        this.generator.forBlock["data"] = (block, _generator) => {
            const immediate = block.getFieldValue("immediate");
            const rb = this.generator.valueToCode(block, "RB", Order.ATOMIC);

            return `DATA ${rb}, ${immediate}`
        };

        this.generator.forBlock["st"] = (block, _generator) => {
            const ra = this.generator.valueToCode(block, "RA", Order.ATOMIC);
            const rb = this.generator.valueToCode(block, "RB", Order.ATOMIC);

            return `ST ${ra}, ${rb}}`
        };

        this.generator.forBlock["ld"] = (block, _generator) => {
            const ra = this.generator.valueToCode(block, "RA", Order.ATOMIC);
            const rb = this.generator.valueToCode(block, "RB", Order.ATOMIC);

            return `LD ${ra}, ${rb}}`
        };

    }
}