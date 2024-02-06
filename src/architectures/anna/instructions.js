import { paddString } from "../../util/string";
import { BaseInstruction } from "../instructions";
import { Word } from "../system";

export class AnnaInstructionFactory {
  createFromMnemonic(mnemonic, instructionMeta) {
    let instructionClass = this.getInstructionClassByMnemonic(mnemonic);
    return new instructionClass(instructionMeta);
  }

  getInstructionClassByMnemonic(mnemonic) {
    return instructionClasses.filter((c) => c.mnemonic == mnemonic)[0];
  }

  createFromOpCode(code) {
    if (code == "1111000000000000") {
      return HaltInstruction.fromMachineCode(code);
    }

    let instructionClass = this.getInstructionClassByOpCode(code.slice(0, 4));
    return instructionClass.fromMachineCode(code);
  }

  getInstructionClassByOpCode(opCode) {
    return instructionClasses.filter((c) => c.opCode == opCode)[0];
  }
}

class AnnaRTypeInstruction extends BaseInstruction {
  constructor(meta) {
    super(meta);
  }

  get rd() {
    return this.meta.args[0] ? parseInt(this.meta.args[0][1]) : 0;
  }

  get rs1() {
    return this.meta.args[1] ? parseInt(this.meta.args[1][1]) : 0;
  }

  get rs2() {
    return this.meta.args[2] ? parseInt(this.meta.args[2][1]) : 0;
  }

  toMachineCode() {
    let machineInstruction =
      this.constructor.opCode + paddString(this.rd.toString(2), 3);
    machineInstruction += paddString(this.rs1.toString(2), 3);
    machineInstruction += paddString(this.rs2.toString(2), 3);
    machineInstruction += "000";

    return machineInstruction;
  }

  toString() {
    let prototype = Object.getPrototypeOf(this);
    return `${prototype.constructor.mnemonic} r${this.rd} r${this.rs1} r${this.rs2}`;
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);
    let rs1 = parseInt(code.slice(7, 10), 2);
    let rs2 = parseInt(code.slice(10, 13), 2);

    let meta = {
      args: [`r${rd}`, `r${rs1}`, `r${rs2}`],
    };

    return meta;
  }
}

class AnnaI6TypeInstruction extends BaseInstruction {
  constructor(meta) {
    super(meta);
  }

  get rd() {
    return this.meta.args[0] ? parseInt(this.meta.args[0][1]) : 0;
  }

  get rs() {
    return this.meta.args[1] ? parseInt(this.meta.args[1][1]) : 0;
  }

  get imm() {
    return this.meta.args[2] ? parseInt(this.meta.args[2]) : 0;
  }

  toMachineCode() {
    let machineInstruction =
      this.constructor.opCode + paddString(this.rd.toString(2), 3);
    machineInstruction += paddString(this.rs.toString(2), 3);
    machineInstruction += Word.fromSignedIntValue(this.imm, 6).toBitString();
    return machineInstruction;
  }

  toString() {
    let prototype = Object.getPrototypeOf(this);
    return `${prototype.constructor.mnemonic} r${this.rd} r${this.rs} #${this.imm}`;
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);
    let rs = parseInt(code.slice(7, 10), 2);

    let immStr = code.slice(10, 16);
    let imm = Word.fromString(immStr).toSignedIntValue();

    let meta = {
      args: [`r${rd}`, `r${rs}`, imm],
    };

    return meta;
  }
}

class AnnaI8TypeInstruction extends BaseInstruction {
  constructor(meta) {
    super(meta);
  }

  get rd() {
    return this.meta.args[0] ? parseInt(this.meta.args[0][1]) : 0;
  }

  get imm() {
    return this.meta.args[1] ? parseInt(this.meta.args[1]) : 0;
  }

  toMachineCode() {
    let machineInstruction =
      this.constructor.opCode + paddString(this.rd.toString(2), 3);
    machineInstruction += "0";
    machineInstruction += Word.fromSignedIntValue(this.imm, 8).toBitString();

    return machineInstruction;
  }

  toString() {
    let prototype = Object.getPrototypeOf(this);
    return `${prototype.constructor.mnemonic} r${this.rd} #${this.imm}`;
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);

    let immStr = code.slice(8, 16);
    let imm = Word.fromString(immStr).toSignedIntValue();

    let meta = {
      args: [`r${rd}`, imm],
    };

    return meta;
  }
}

export class AddInstruction extends AnnaRTypeInstruction {
  static mnemonic = "add";
  static opCode = "0000";

  executeOn(system) {
    let target = system.registers[this.rd];
    let firstOperand = system.registers[this.rs1];
    let secondOperand = system.registers[this.rs2];

    let result = firstOperand.add(secondOperand);
    target.set(result);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new AddInstruction(meta);
  }
}

export class AddImmedateInstruction extends AnnaI6TypeInstruction {
  static mnemonic = "addi";
  static opCode = "1100";

  executeOn(system) {
    let target = system.registers[this.rd];
    let firstOperand = system.registers[this.rs];
    let immedate = Number(this.imm);

    let result = firstOperand.addImmedate(immedate);
    target.set(result);
  }

  static fromMachineCode(code) {
    let meta = AnnaI6TypeInstruction.extractMeta(code);
    return new AddImmedateInstruction(meta);
  }
}

export class SubtractInstruction extends AnnaRTypeInstruction {
  static mnemonic = "sub";
  static opCode = "0001";

  executeOn(system) {
    let target = system.registers[this.rd];
    let firstOperand = system.registers[this.rs1];
    let secondOperand = system.registers[this.rs2];

    let result = firstOperand.subtract(secondOperand);
    target.set(result);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new SubtractInstruction(meta);
  }
}

export class AndInstruction extends AnnaRTypeInstruction {
  static mnemonic = "and";
  static opCode = "0010";

  executeOn(system) {
    let target = system.registers[this.rd];
    let firstOperand = system.registers[this.rs1];
    let secondOperand = system.registers[this.rs2];

    let result = firstOperand.and(secondOperand);
    target.set(result);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new AndInstruction(meta);
  }
}

export class OrInstruction extends AnnaRTypeInstruction {
  static mnemonic = "or";
  static opCode = "0011";

  executeOn(system) {
    let target = system.registers[this.rd];
    let firstOperand = system.registers[this.rs1];
    let secondOperand = system.registers[this.rs2];

    let result = firstOperand.or(secondOperand);
    target.set(result);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new OrInstruction(meta);
  }
}

export class NotInstruction extends AnnaRTypeInstruction {
  static mnemonic = "not";
  static opCode = "0100";

  executeOn(system) {
    let target = system.registers[this.rd];
    let operand = system.registers[this.rs1];

    target.set(operand.invert());
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new NotInstruction(meta);
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);
    let rs1 = parseInt(code.slice(7, 10), 2);

    let meta = {
      args: [`r${rd}`, `r${rs1}`],
    };

    return meta;
  }
}

export class ShiftInstruction extends AnnaI6TypeInstruction {
  static mnemonic = "shf";
  static opCode = "0101";

  executeOn(system) {
    let target = system.registers[this.rd];
    let operand = system.registers[this.rs];
    let immedate = Number(this.imm);

    target.set(operand.shift(immedate));
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new ShiftInstruction(meta);
  }
}

export class LoadLowerImmedateInstruction extends AnnaI8TypeInstruction {
  static mnemonic = "lli";
  static opCode = "0110";

  executeOn(system) {
    let target = system.registers[this.rd];
    let immediate = Number(this.imm);

    let mask = Word.fromString("0000000011111111");
    let immediateWord = Word.fromSignedIntValue(immediate).and(mask);

    target.set(target.and(mask.invert()).or(immediateWord));
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new LoadLowerImmedateInstruction(meta);
  }
}

export class LoadUpperImmedateInstruction extends AnnaI8TypeInstruction {
  static mnemonic = "lui";
  static opCode = "0111";

  executeOn(system) {
    let target = system.registers[this.rd];
    let immedate = Number(this.imm);

    let mask = Word.fromString("0000000011111111");
    let immedateWord = Word.fromSignedIntValue(immedate).and(mask).shift(8);

    target.set(target.and(mask).or(immedateWord));
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new LoadUpperImmedateInstruction(meta);
  }
}

export class LoadWordInstruction extends AnnaI6TypeInstruction {
  static mnemonic = "lw";
  static opCode = "1000";

  executeOn(system) {
    let target = system.registers[this.rd];
    let source = system.registers[this.rs];
    let offset = Number(this.imm);

    target.set(system.loadFromMemory(source.toSignedIntValue() + offset));
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new LoadWordInstruction(meta);
  }
}

export class StoreWordInstruction extends AnnaI6TypeInstruction {
  static mnemonic = "sw";
  static opCode = "1001";

  executeOn(system) {
    let destination = system.registers[this.rd];
    let source = system.registers[this.rs];
    let offset = this.imm;

    system.storeToMemory(source.toSignedIntValue() + offset, destination);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new StoreWordInstruction(meta);
  }
}

export class BranchEqualZeroInstruction extends AnnaI8TypeInstruction {
  static mnemonic = "bez";
  static opCode = "1010";

  executeOn(system) {
    let checkWord = system.registers[this.rd];

    if (checkWord.toSignedIntValue() == 0) {
      let pcVal = system.registers["pc"].toSignedIntValue();
      system.registers["pc"].set(Word.fromSignedIntValue(pcVal + this.imm));
    }
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new BranchEqualZeroInstruction(meta);
  }
}

export class BranchGreaterZeroInstruction extends AnnaI8TypeInstruction {
  static mnemonic = "bgz";
  static opCode = "1011";

  executeOn(system) {
    let checkWord = system.registers[this.rd];

    if (checkWord.toSignedIntValue() > 0) {
      let pcVal = system.registers["pc"].toSignedIntValue();
      system.registers["pc"].set(Word.fromSignedIntValue(pcVal + this.imm));
    }
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new BranchGreaterZeroInstruction(meta);
  }
}

export class JumpAndLinkRegisterInstruction extends AnnaRTypeInstruction {
  static mnemonic = "jalr";
  static opCode = "1101";

  executeOn(system) {
    let target = system.registers[this.rd];
    let source = system.registers[this.rs1];

    source.set(system.registers["pc"].add(Word.fromSignedIntValue(1)));
    system.registers["pc"].set(target);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new JumpAndLinkRegisterInstruction(meta);
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);
    let rs1 = parseInt(code.slice(7, 10), 2);

    let meta = {
      args: [`r${rd}`, `r${rs1}`],
    };

    return meta;
  }
}

export class InputInstruction extends AnnaRTypeInstruction {
  static mnemonic = "in";
  static opCode = "1110";

  executeOn(system) {
    let target = system.registers[this.rd];
    let result = system.callInterrupt("input");

    target.set(Word.fromSignedIntValue(result));
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new InputInstruction(meta);
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);

    let meta = {
      args: [`r${rd}`],
    };

    return meta;
  }
}

export class OutputInstruction extends AnnaRTypeInstruction {
  static mnemonic = "out";
  static opCode = "1111";

  executeOn(system) {
    let source = system.registers[this.rd];

    system.callInterrupt("output", source);
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new OutputInstruction(meta);
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);

    let meta = {
      args: [`r${rd}`],
    };

    return meta;
  }
}

export class HaltInstruction extends AnnaRTypeInstruction {
  static mnemonic = ".halt";
  static opCode = "1111";

  executeOn(system) {
    system.callInterrupt("halt");
  }

  toMachineCode() {
    return "1111000000000000";
  }

  static fromMachineCode(code) {
    let meta = this.extractMeta(code);
    return new HaltInstruction(meta);
  }

  static extractMeta(code) {
    let rd = parseInt(code.slice(4, 7), 2);

    let meta = {
      args: [`r${rd}`],
    };

    return meta;
  }
}

const instructionClasses = [
  BranchEqualZeroInstruction,
  BranchGreaterZeroInstruction,
  JumpAndLinkRegisterInstruction,
  AddInstruction,
  AddImmedateInstruction,
  SubtractInstruction,
  AndInstruction,
  OrInstruction,
  NotInstruction,
  ShiftInstruction,
  LoadLowerImmedateInstruction,
  LoadUpperImmedateInstruction,
  InputInstruction,
  OutputInstruction,
  LoadWordInstruction,
  StoreWordInstruction,
  HaltInstruction,
];
