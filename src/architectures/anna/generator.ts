import {BaseBlocklyGenerator, Order} from "@/architectures/generator";
import {Block, Generator} from "blockly";


export class AnnaBlocklyGenerator extends BaseBlocklyGenerator {
    constructor() {
        super("anna");
    }

    setupGenerator(): void {
        super.setupGenerator();

        this.generator.forBlock["add"] = (block: Block): string => {
            const rs1 = this.generator.valueToCode(block, "rs1", Order.ATOMIC);
            const rs2 = this.generator.valueToCode(block, "rs2", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `add ${rd} ${rs1} ${rs2}`;
        };

        this.generator.forBlock["register"] = (block: Block, _generator: Generator) => {
            const registerNr = block.getFieldValue("registerNr");

            return [`r${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["addi"] = (block: Block) => {
            const rs1 = this.generator.valueToCode(block, "rs1", Order.ATOMIC);
            const immediate = block.getFieldValue("immediate");
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `addi ${rd} ${rs1} ${immediate}`;
        };

        this.generator.forBlock["sub"] = (block: Block) => {
            const rs1 = this.generator.valueToCode(block, "rs1", Order.ATOMIC);
            const rs2 = this.generator.valueToCode(block, "rs2", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `sub ${rd} ${rs1} ${rs2}`;
        };

        this.generator.forBlock["lli"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const immediate = block.getFieldValue("immediate");

            return `lli ${rd} ${immediate}`;
        };

        this.generator.forBlock["lli_label"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const label = this.generator.valueToCode(block, "label", Order.ATOMIC);

            return `lli ${rd} ${label}`;
        };

        this.generator.forBlock["lui_label"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const label = this.generator.valueToCode(block, "label", Order.ATOMIC);

            return `lui ${rd} ${label}`;
        };

        this.generator.forBlock["lui"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const immediate = block.getFieldValue("immediate");

            return `lui ${rd} ${immediate}`;
        };

        this.generator.forBlock["and"] = (block: Block) => {
            const rs1 = this.generator.valueToCode(block, "rs1", Order.ATOMIC);
            const rs2 = this.generator.valueToCode(block, "rs2", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `and ${rd} ${rs1} ${rs2}`;
        };

        this.generator.forBlock["or"] = (block: Block) => {
            const rs1 = this.generator.valueToCode(block, "rs1", Order.ATOMIC);
            const rs2 = this.generator.valueToCode(block, "rs2", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `or ${rd} ${rs1} ${rs2}`;
        };

        this.generator.forBlock["not"] = (block: Block) => {
            const rs = this.generator.valueToCode(block, "rs", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `not ${rd} ${rs}`;
        };

        this.generator.forBlock["shf"] = (block: Block) => {
            const rs = this.generator.valueToCode(block, "rs", Order.ATOMIC);
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const immediate = block.getFieldValue("immediate");

            return `shf ${rd} ${rs} ${immediate}`;
        };

        this.generator.forBlock["lw"] = (block: Block) => {
            const rs = this.generator.valueToCode(block, "rs", Order.ATOMIC);
            const offset = block.getFieldValue("offset");
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `lw ${rd} ${rs} ${offset}`;
        };

        this.generator.forBlock["sw"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const rs = this.generator.valueToCode(block, "rs", Order.ATOMIC);
            const offset = block.getFieldValue("offset");
            return `sw ${rd} ${rs} ${offset}`;
        };

        this.generator.forBlock["in"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `in ${rd}`;
        };

        this.generator.forBlock["out"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);

            return `out ${rd}`;
        };

        this.generator.forBlock["bez"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const label = this.generator.valueToCode(block, "label", Order.ATOMIC);

            return `bez ${rd} ${label}`;
        };

        this.generator.forBlock["bgz"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const label = this.generator.valueToCode(block, "label", Order.ATOMIC);

            return `bgz ${rd} ${label}`;
        };

        this.generator.forBlock["jalr"] = (block: Block) => {
            const rd = this.generator.valueToCode(block, "rd", Order.ATOMIC);
            const rs = this.generator.valueToCode(block, "rs", Order.ATOMIC);

            return `jalr ${rd} ${rs}`;
        };

        this.generator.forBlock["halt"] = (_block: Block, _generator) => {
            return ".halt";
        };

        this.generator.forBlock["start"] = (_block: Block, _generator) => {
            return "";
        };

        const generateRegister = (block: Block, _generator: Generator): [string, number] => {
            return [block.type, Order.ATOMIC];
        };

        this.generator.forBlock["r0"] = generateRegister;
        this.generator.forBlock["r1"] = generateRegister;
        this.generator.forBlock["r2"] = generateRegister;
        this.generator.forBlock["r3"] = generateRegister;
        this.generator.forBlock["r4"] = generateRegister;
        this.generator.forBlock["r5"] = generateRegister;
        this.generator.forBlock["r6"] = generateRegister;
        this.generator.forBlock["r7"] = generateRegister;

        this.generator.forBlock["labelDef"] = (block) => {
            let label = block.getFieldValue("labelName");
            return `${label}:`;
        };

        this.generator.forBlock["label"] = (block, _generator) => {
            const labelName = block.getFieldValue("label_name");

            return [`&${labelName}`, Order.ATOMIC];
        };

        this.generator.forBlock["fill"] = (block, _generator) => {
            const immediate = block.getFieldValue("immediate");

            return `.fill ${immediate}`;
        };
    }
}