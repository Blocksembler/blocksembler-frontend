import {BaseInstruction} from "../instructions";
import {Word} from "../system";

export class InsperHackInstructionFactory {
  createFromMnemonic(mnemonic, args) {
    let instructionClass = this.getInstructionClassByMnemonic(mnemonic);
    return new instructionClass(args);
  }

  getInstructionClassByMnemonic(mnemonic) {
    return mnemonicToClass[mnemonic];
  }

  createFromOpCode(memory, address) {
    const code = memory[address].toBitString();

    let aluCode = code.slice(3, 10);

    // is lea ?
    // true then return lea class

    // is jump-instruction ?
    // true then find jump-instruction

    // is nop ? (no dest, no jump -> dest=000, jmp=000)

    switch (aluCode) {
      // is inc or dec
      case "0011111": // %D+1
        return IncInstruction.fromMachineCode(code);
      case "0110111": // %A+1
        return IncInstruction.fromMachineCode(code);
      case "0001110": // %D-1
        return DecInstruction.fromMachineCode(code);
      case "0110010": // %A-1
        return DecInstruction.fromMachineCode(code);
      // c-bits instructions (ALU-code -> a and c bits)
      case "0001101": // !%D
        return NotInstruction.fromMachineCode(code);
      case "0110001": // !%A
        return NotInstruction.fromMachineCode(code);
      case "0001111": // -%D
        return NegInstruction.fromMachineCode(code);
      case "0110011": // -%A
        return NegInstruction.fromMachineCode(code);
      default:
        break;
    }
  }
}

export class InsperHackInstruction extends BaseInstruction {
  get op1() {
    return this.args[0];
  }
  get op2() {
    return this.args[1];
  }
  get dest() {
    return this.args.slice(2);
  }

  static extractMemoryBit(code) {
    return code.slice(3, 4);
  }
  static extractOpCode(code) {
    return code.slice(4, 10);
  }
  static extractDestCode(code) {
    return code.slice(10, 13);
  }
  static extractJumpCode(code) {
    return code.slice(13, 16);
  }

  // append 000 for no jump operations
  noJump(code) {
    code += "000";
    return code;
  }
  getRegValue(system, operand) {
    return system.registers[operand];
  }

  getMemoryAddress(system) {
    // get value of Memory
    let address = system.registers["%A"].toUnsignedIntValue();
    // set value
    return system.memory[address];
  }

  getImmediateValue(operand) {
    //turns immediate into a number - then a Word
    let imm = parseInt(operand.slice(1));
    return Word.fromSignedIntValue(imm);
  }

  isMemoryAccess(param) {
    return param.startsWith("(");
  }
}

export class OverwriteInstruction extends InsperHackInstruction {
  // checks if argument is valid and returns its code
  static matchCode(code) {
    let memoryBit = this.extractMemoryBit(code);
    let opCode = this.extractOpCode(code);
    let cCode = memoryBit + opCode;

    if (cCode in this.cCodeToArgs) {
      return this.cCodeToArgs[cCode];
    } else {
      throw new Error("Argument is not valid.");
    }
  }
  argToDest = {
    "%D": "010", // d Code
    "%A": "100",
  };
  // checks if destination(arg) is valid and returns its code
  matchDest(arg) {
    if (arg in this.argToDest) {
      return this.argToDest[arg];
    } else {
      throw new Error("Destination is not valid.");
    }
  }
  //converts instruction to machine code
  toMachineCode() {
    // setup instruction code
    let code = "111";
    // get opCode and append
    let opCode = this.argsToCcode[this.args[0]];
    code += opCode;
    // append param and destination
    code += this.noJump(this.matchDest(this.args[0]));
    return code;
  }
  //gets the word of the operand
  getOpWord(system, operand) {
    return this.getRegValue(system, operand);
  }
  // gets the destination of the instruction with argument arg
  getDestWord(system, arg) {
    return this.getRegValue(system, arg);
  }
}

export class IncInstruction extends OverwriteInstruction {
  static cCodeToArgs = {
    "0011111": ["%D"],
    "0110111": ["%A"],
  };
  argsToCcode = {
    "%D": "0011111", //a+c Code
    "%A": "0110111",
  };
  static fromMachineCode(code) {
    let arg = this.matchCode(code);
    return new IncInstruction(arg);
  }
  executeOn(system) {
    // operand 1 reg
    let resultWord = this.getOpWord(system, this.op1).inc();
    // overwrite with its negation
    this.getDestWord(system, this.args[0]).set(resultWord);
  }
}

export class DecInstruction extends OverwriteInstruction {
  static cCodeToArgs = {
    "0001110": ["%D"],
    "0110010": ["%A"],
  };
  argsToCcode = {
    "%D": "0001110", //a+c Code
    "%A": "0110010",
  };
  static fromMachineCode(code) {
    let arg = this.matchCode(code);
    return new DecInstruction(arg);
  }
  executeOn(system) {
    // operand 1 reg
    let resultWord = this.getOpWord(system, this.op1).dec();
    // overwrite with its negation
    this.getDestWord(system, this.args[0]).set(resultWord);
  }
}

export class NotInstruction extends OverwriteInstruction {
  static cCodeToArgs = {
    "0001101": ["%D"],
    "0110001": ["%A"],
  };
  argsToCcode = {
    "%D": "0001101", //a+c Code
    "%A": "0110001",
  };
  static fromMachineCode(code) {
    let arg = this.matchCode(code);
    return new NotInstruction(arg);
  }
  executeOn(system) {
    // operand 1 reg
    let resultWord = this.getOpWord(system, this.op1).invert();
    // overwrite with its negation
    this.getDestWord(system, this.args[0]).set(resultWord);
  }
}

export class NegInstruction extends OverwriteInstruction {
  static cCodeToArgs = {
    "0001111": ["%D"],
    "0110011": ["%A"],
  };
  argsToCcode = {
    "%D": "0001111", //a+c Code
    "%A": "0110011",
  };
  static fromMachineCode(code) {
    let arg = this.matchCode(code);
    return new NegInstruction(arg);
  }
  executeOn(system) {
    // operand 1 reg
    let resultWord = this.getOpWord(system, this.op1).invert().addImmediate(1);
    // overwrite with its negation
    this.getDestWord(system, this.args[0]).set(resultWord);
  }
}

const mnemonicToClass = {
  inc: IncInstruction,
  dec: DecInstruction,
  not: NotInstruction,
  neg: NegInstruction,
};
