import {BaseInstruction} from "../instructions";
import {BaseEmulator, Word} from "../emulator";
import {MemoryLocation} from "@/types/emulator";
import {addressSize} from "@/architectures/anna/emulator";
import {BlockSvg, WorkspaceSvg} from "blockly";

const attachRegisterBlock = (ws: WorkspaceSvg, instructionBlock: BlockSvg, inputName: string, registerName: string) => {
    let regConnection = instructionBlock.getInput(inputName)?.connection;

    if (regConnection) {
        const regBlock = ws.newBlock(registerName);
        regBlock.initSvg();

        regConnection.connect(regBlock.outputConnection);
    }
}

const attachLabelBlock = (ws: WorkspaceSvg, instructionBlock: BlockSvg, inputName: string, label: string) => {
    let labelConnection = instructionBlock.getInput(inputName)?.connection;

    if (labelConnection) {
        const labelBlock = ws.newBlock("label");
        labelBlock.initSvg();
        labelBlock.setFieldValue(label, "name");

        labelConnection.connect(labelBlock.outputConnection);
    }
}

export class AnnaInstructionFactory {
    createFromMnemonic(mnemonic: string, args: Array<string>): BaseInstruction {
        let instructionClass = this.getInstructionClassByMnemonic(mnemonic);

        return new instructionClass(args);
    }

    getInstructionClassByMnemonic(mnemonic: string): typeof AnnaBaseInstruction {
        for (let clazz of instructionClasses) {
            if (clazz.getMnemonic() === mnemonic) {
                return clazz;
            }
        }

        throw Error(`Unknown instruction ${mnemonic}`);
    }


    createFromOpCode(memory: Array<MemoryLocation>, address: number): AnnaBaseInstruction {
        let code = memory[address].value.toBitString()

        if (code === "1111000000000000") {
            return HaltInstruction.fromMachineCode(code);
        }

        let instructionClass = this.getInstructionClassByOpCode(code.slice(0, 4));

        return instructionClass.fromMachineCode(code);
    }

    getInstructionClassByOpCode(opCode: string): typeof AnnaBaseInstruction {

        for (let clazz of instructionClasses) {
            if (clazz.getOpCode() === opCode) {
                return clazz;
            }
        }

        throw Error(`Unknown opCode ${opCode}`);
    }
}

class AnnaBaseInstruction extends BaseInstruction {
    get blockType(): string {
        let constructor = this.constructor as typeof AnnaBaseInstruction;
        return constructor.getMnemonic();
    }

    static getOpCode(): string {
        throw Error("Not implemented");
    }

    static getMnemonic(): string {
        throw Error("Not implemented");
    }

    static fromMachineCode(_code: string): AnnaBaseInstruction {
        throw Error("Not implemented");
    }

    toBlocks(ws: WorkspaceSvg): Array<BlockSvg> {
        const blocks: Array<BlockSvg> = [];

        const instructionBlock = this.getInstructionBlock(ws);

        if (this.labels.length > 0) {
            const labelBlock = ws.newBlock("labelDef");
            labelBlock.initSvg();
            labelBlock.setFieldValue(this.labels[0], "name");
            labelBlock.nextConnection.connect(instructionBlock.previousConnection)
            blocks.push(labelBlock);
        }

        blocks.push(instructionBlock);
        return blocks;
    }

    getInstructionBlock(ws: WorkspaceSvg): BlockSvg {
        const instructionBlock = ws.newBlock(this.blockType);
        instructionBlock.initSvg();
        this.setInstructionArguments(ws, instructionBlock);
        return instructionBlock;
    }

    setInstructionArguments(_ws: WorkspaceSvg, _block: BlockSvg) {
    }
}

class AnnaRTypeInstruction extends AnnaBaseInstruction {

    get rd() {
        return this.args[0] ? parseInt(this.args[0][1]) : 0;
    }

    get rs1() {
        return this.args[1] ? parseInt(this.args[1][1]) : 0;
    }

    get rs2() {
        return this.args[2] ? parseInt(this.args[2][1]) : 0;
    }

    static extractArgs(code: string) {
        let rd = parseInt(code.slice(4, 7), 2);
        let rs1 = parseInt(code.slice(7, 10), 2);
        let rs2 = parseInt(code.slice(10, 13), 2);

        return [`r${rd}`, `r${rs1}`, `r${rs2}`];
    }

    toMachineCode() {
        const constructor = (this.constructor as typeof AnnaRTypeInstruction);
        let machineInstruction = constructor.getOpCode() + this.rd.toString(2).padStart(3, "0");
        machineInstruction += this.rs1.toString(2).padStart(3, "0");
        machineInstruction += this.rs2.toString(2).padStart(3, "0");
        machineInstruction += "000";
        return machineInstruction;
    }

    toString() {
        const constructor = (this.constructor as typeof AnnaRTypeInstruction);
        return `${constructor.getMnemonic()} r${this.rd} r${this.rs1} r${this.rs2}`;
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        attachRegisterBlock(ws, block, "rs1", `r${this.rs1}`);
        attachRegisterBlock(ws, block, "rs2", `r${this.rs2}`);
    }
}

class AnnaI6TypeInstruction extends AnnaBaseInstruction {

    get rd() {
        return this.args[0] ? parseInt(this.args[0][1]) : 0;
    }

    get rs() {
        return this.args[1] ? parseInt(this.args[1][1]) : 0;
    }

    get imm() {
        return this.args[2] ? parseInt(this.args[2]) : 0;
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);
        let rs = parseInt(code.slice(7, 10), 2);

        let immStr = code.slice(10, 16);
        let imm = Word.fromString(immStr, 6).toSignedIntValue();

        return [`r${rd}`, `r${rs}`, `${imm}`];
    }

    toMachineCode(): string {
        const constructor = (this.constructor as typeof AnnaI6TypeInstruction);
        let machineInstruction =
            constructor.getOpCode() + this.rd.toString(2).padStart(3, "0");
        machineInstruction += this.rs.toString(2).padStart(3, "0");
        machineInstruction += Word.fromSignedIntValue(this.imm, 6).toBitString();
        return machineInstruction;
    }

    toString(): string {
        const constructor = (this.constructor as typeof AnnaI6TypeInstruction);
        return `${constructor.getMnemonic()} r${this.rd} r${this.rs} #${this.imm}`;
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        attachRegisterBlock(ws, block, "rs1", `r${this.rs}`);

        block.setFieldValue(this.imm, "immediate");
    }

}

class AnnaI8TypeInstruction extends AnnaBaseInstruction {

    get rd() {
        return this.args[0] ? parseInt(this.args[0][1]) : 0;
    }

    get imm() {
        return this.args[1] ? parseInt(this.args[1]) : 0;
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);

        let immStr = code.slice(8, 16);
        let imm = Word.fromString(immStr, 8).toSignedIntValue();

        return [`r${rd}`, `${imm}`];
    }

    toMachineCode() {
        const constructor = (this.constructor as typeof AnnaI8TypeInstruction);


        console.log("imm", this.imm);

        let machineInstruction =
            constructor.getOpCode() + this.rd.toString(2).padStart(3, "0");
        machineInstruction += "0";
        machineInstruction += Word.fromSignedIntValue(this.imm, 8).toBitString();

        return machineInstruction;
    }

    toString() {
        const constructor = (this.constructor as typeof AnnaI8TypeInstruction);
        return `${constructor.getMnemonic()} r${this.rd} #${this.imm}`;
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        block.setFieldValue(this.imm, "immediate");
    }
}

export class AddInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "add";
    }

    static getOpCode(): string {
        return "0000";
    }

    static fromMachineCode(code: string): AnnaBaseInstruction {
        let args = this.extractArgs(code);
        return new AddInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let firstOperand = system.registers[`r${this.rs1}`];
        let secondOperand = system.registers[`r${this.rs2}`];

        let result = firstOperand.add(secondOperand);
        target.set(result);
    }
}

export class AddImmediateInstruction extends AnnaI6TypeInstruction {
    static getMnemonic(): string {
        return "addi";
    }

    static getOpCode(): string {
        return "1100";
    }

    static fromMachineCode(code: string): AnnaBaseInstruction {
        let args: Array<string> = AnnaI6TypeInstruction.extractArgs(code);
        return new AddImmediateInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let firstOperand = system.registers[`r${this.rs}`];
        let immediate = Number(this.imm);

        let result = firstOperand.addImmediate(immediate);
        target.set(result);
    }
}

export class SubtractInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "sub";
    }

    static getOpCode(): string {
        return "0001";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new SubtractInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let firstOperand = system.registers[`r${this.rs1}`];
        let secondOperand = system.registers[`r${this.rs2}`];

        let result = firstOperand.subtract(secondOperand);
        target.set(result);
    }
}

export class AndInstruction extends AnnaRTypeInstruction {
    static getMnemonic(): string {
        return "and";
    }

    static getOpCode(): string {
        return "0010";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new AndInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let firstOperand = system.registers[`r${this.rs1}`];
        let secondOperand = system.registers[`r${this.rs2}`];

        let result = firstOperand.and(secondOperand);
        target.set(result);
    }
}

export class OrInstruction extends AnnaRTypeInstruction {
    static getMnemonic(): string {
        return "or";
    }

    static getOpCode(): string {
        return "0011";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new OrInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let firstOperand = system.registers[`r${this.rs1}`];
        let secondOperand = system.registers[`r${this.rs2}`];

        let result = firstOperand.or(secondOperand);
        target.set(result);
    }
}

export class NotInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "not";
    }

    static getOpCode(): string {
        return "0100";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new NotInstruction(args);
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);
        let rs1 = parseInt(code.slice(7, 10), 2);

        return [`r${rd}`, `r${rs1}`];
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let operand = system.registers[`r${this.rs1}`];

        target.set(operand.invert());
    }
}

export class ShiftInstruction extends AnnaI6TypeInstruction {

    static getMnemonic(): string {
        return "shf";
    }

    static getOpCode(): string {
        return "0101";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new ShiftInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let operand = system.registers[`r${this.rs}`];
        let immediate = Number(this.imm);

        target.set(operand.shift(immediate));
    }
}

export class LoadLowerImmediateInstruction extends AnnaI8TypeInstruction {

    static getMnemonic(): string {
        return "lli";
    }

    static getOpCode(): string {
        return "0110";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new LoadLowerImmediateInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let immediate = Number(this.imm);

        let mask = Word.fromString("0000000011111111");
        let immediateWord = Word.fromSignedIntValue(immediate).and(mask);

        target.set(target.and(mask.invert()).or(immediateWord));
    }

    getInstructionBlock(ws: WorkspaceSvg): BlockSvg {
        let instructionBlock;

        if (this.args[1].startsWith("&")) {
            instructionBlock = ws.newBlock("lli_label");
            instructionBlock.initSvg();
        } else {
            instructionBlock = ws.newBlock("lli");
            instructionBlock.initSvg();
        }

        this.setInstructionArguments(ws, instructionBlock);

        return instructionBlock;
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        if (this.args[1].startsWith("&")) {
            attachLabelBlock(ws, block, "label", this.args[1].slice(1, this.args[1].length));
        } else {
            block.setFieldValue(this.imm, "immediate");
        }
    }

}

export class LoadUpperImmediateInstruction extends AnnaI8TypeInstruction {

    static getMnemonic(): string {
        return "lui";
    }

    static getOpCode(): string {
        return "0111";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new LoadUpperImmediateInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let immediate = Number(this.imm);

        let mask = Word.fromString("0000000011111111");
        let immediateWord = Word.fromSignedIntValue(immediate).and(mask).shift(8);

        target.set(target.and(mask).or(immediateWord));
    }

    getInstructionBlock(ws: WorkspaceSvg): BlockSvg {
        let instructionBlock;

        console.log("args", this.args);
        if (this.args[1].startsWith("&")) {
            instructionBlock = ws.newBlock("lui_label");
            instructionBlock.initSvg();
        } else {
            instructionBlock = ws.newBlock("lui");
            instructionBlock.initSvg();
        }

        this.setInstructionArguments(ws, instructionBlock);

        return instructionBlock;
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        if (this.args[1].startsWith("&")) {
            attachLabelBlock(ws, block, "label", this.args[1].slice(1, this.args[1].length));
        } else {
            block.setFieldValue(this.imm, "immediate");
        }
    }
}

export class LoadWordInstruction extends AnnaI6TypeInstruction {

    static getMnemonic(): string {
        return "lw";
    }

    static getOpCode(): string {
        return "1000";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new LoadWordInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let source = system.registers[`r${this.rs}`];
        let offset = Number(this.imm);

        target.set(system.loadFromMemory(source.toUnsignedIntValue() + offset));
    }
}

export class StoreWordInstruction extends AnnaI6TypeInstruction {

    static getMnemonic(): string {
        return "sw";
    }

    static getOpCode(): string {
        return "1001";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new StoreWordInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let destination = system.registers[`r${this.rd}`];
        let source = system.registers[`r${this.rs}`];
        let offset = this.imm;

        system.storeToMemory(source.toUnsignedIntValue() + offset, destination);
    }
}

export class BranchEqualZeroInstruction extends AnnaI8TypeInstruction {

    static getMnemonic(): string {
        return "bez";
    }

    static getOpCode(): string {
        return "1010";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new BranchEqualZeroInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let checkWord = system.registers[`r${this.rd}`];

        if (checkWord.toSignedIntValue() === 0) {
            let pcVal = system.registers["pc"].toSignedIntValue();
            system.registers["pc"].set(Word.fromSignedIntValue(pcVal + this.imm));
        }
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        let label = this.args[this.args.length - 1];
        label = label.slice(1, label.length);

        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        attachLabelBlock(ws, block, "label", label);
    }
}

export class BranchGreaterZeroInstruction extends AnnaI8TypeInstruction {

    static getMnemonic(): string {
        return "bgz";
    }

    static getOpCode(): string {
        return "1011";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new BranchGreaterZeroInstruction(args);
    }

    executeOn(system: BaseEmulator) {
        let checkWord = system.registers[`r${this.rd}`];

        if (checkWord.toSignedIntValue() > 0) {
            let pcVal = system.registers["pc"].toSignedIntValue();
            system.registers["pc"].set(Word.fromSignedIntValue(pcVal + this.imm));
        }
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        let label = this.args[this.args.length - 1];
        label = label.slice(1, label.length);

        attachRegisterBlock(ws, block, "rd", `r${this.rd}`);
        attachLabelBlock(ws, block, "label", label);
    }
}

export class JumpAndLinkRegisterInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "jalr";
    }

    static getOpCode(): string {
        return "1101";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new JumpAndLinkRegisterInstruction(args);
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);
        let rs1 = parseInt(code.slice(7, 10), 2);

        return [`r${rd}`, `r${rs1}`];
    }

    executeOn(system: BaseEmulator) {
        let targetAddress = system.registers[`r${this.rd}`].toUnsignedIntValue();
        let source = system.registers[`r${this.rs1}`];

        source.set(system.registers["pc"]);
        system.registers["pc"].set(Word.fromSignedIntValue(targetAddress, addressSize));
    }
}

export class InputInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "in";
    }

    static getOpCode(): string {
        return "1110";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new InputInstruction(args);
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);

        return [`r${rd}`];
    }

    executeOn(system: BaseEmulator) {
        let target = system.registers[`r${this.rd}`];
        let result = system.callInterrupt("input");

        if (result === null)
            return

        target.set(Word.fromSignedIntValue(parseInt(result)));
    }
}

export class OutputInstruction extends AnnaRTypeInstruction {

    static getMnemonic(): string {
        return "out";
    }

    static getOpCode(): string {
        return "1111";
    }

    static fromMachineCode(code: string) {
        let args = this.extractArgs(code);
        return new OutputInstruction(args);
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);

        return [`r${rd}`];
    }

    executeOn(system: BaseEmulator) {
        let source = system.registers[`r${this.rd}`];

        system.callInterrupt("output", source.toString());
    }
}

export class HaltInstruction extends AnnaRTypeInstruction {

    constructor() {
        super([])
    }

    get blockType() {
        return "halt";
    }

    static getMnemonic(): string {
        return ".halt";
    }

    static getOpCode(): string {
        return "1111";
    }

    static fromMachineCode(_code: string) {
        return new HaltInstruction();
    }

    static extractArgs(code: string): Array<string> {
        let rd = parseInt(code.slice(4, 7), 2);

        return [`r${rd}`];
    }

    executeOn(system: BaseEmulator) {
        system.callInterrupt("halt");
    }

    toMachineCode() {
        return "1111000000000000";
    }
}

export class FillDirective extends AnnaBaseInstruction {
    get blockType() {
        return "fill";
    }

    static getMnemonic(): string {
        return ".fill";
    }

    static getOpCode(): string {
        return "";
    }

    toMachineCode() {
        const immediate: number = Number.parseInt(this.args[0]);
        return Word.fromSignedIntValue(immediate, addressSize).toBitString();
    }

    setInstructionArguments(ws: WorkspaceSvg, block: BlockSvg) {
        block.setFieldValue(this.args[0], "immediate");
    }
}

const instructionClasses: Array<typeof AnnaBaseInstruction> = [
    BranchEqualZeroInstruction,
    BranchGreaterZeroInstruction,
    JumpAndLinkRegisterInstruction,
    AddInstruction,
    AddImmediateInstruction,
    SubtractInstruction,
    AndInstruction,
    OrInstruction,
    NotInstruction,
    ShiftInstruction,
    LoadLowerImmediateInstruction,
    LoadUpperImmediateInstruction,
    InputInstruction,
    OutputInstruction,
    LoadWordInstruction,
    StoreWordInstruction,
    HaltInstruction,
    FillDirective
];

