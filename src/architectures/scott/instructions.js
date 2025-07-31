import {BaseInstruction} from "@/architectures/instructions.js";
import {Word} from "@/architectures/emulator.ts";

export class ScottInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        const instClass = allInstructionClasses.filter(instClass => instClass.mnemonic === mnemonic)[0];

        if (!instClass) {
            throw new Error(`No instruction for mnemonic "${mnemonic}" found.`);
        }

        return new instClass(args);
    }


    createFromOpCode(memory, address) {
        const opCode = memory[address].value.toBitString().slice(0, 4);
        const instClass = instructionClasses.filter(instClass => instClass.opCode === opCode)[0];

        if (!instClass) {
            throw new Error(`No instruction for opCode "${opCode}" found.`);
        }

        return instClass.fromMachineCode(memory[address], memory[address + 1]);
    }
}

class ScottInstruction extends BaseInstruction {

    get regALabel() {
        return this.args[0]
    }

    get regBLabel() {
        return this.args[1]
    }

    get immediate() {
        return ""
    }

    static fromMachineCode(instWord, _immediateWord) {
        const regA = `R${parseInt(instWord.value.toBitString().slice(4, 6), 2)}`
        const regB = `R${parseInt(instWord.value.toBitString().slice(6, 8), 2)}`

        return new this([regA, regB]);
    }

    toString() {
        return `${this.constructor.mnemonic} ${this.args.join(", ")}`;
    }

    toMachineCode() {
        let regACode = "00";
        if (this.regALabel !== "") {
            regACode = Number(this.regALabel[1]).toString(2).padStart(2, "0");
        }

        let regBCode = "00";
        if (this.regBLabel !== "") {
            regBCode = Number(this.regBLabel[1]).toString(2).padStart(2, "0");
        }

        if (this.immediate !== "") {
            const encodedImmediate = Number(this.immediate).toString(2).padStart(8, "0");
            return `${this.constructor.opCode}${regACode}${regBCode}${encodedImmediate}`;
        }

        return `${this.constructor.opCode}${regACode}${regBCode}`;
    }

    setCFlag(system, regAVal, regBVal) {
        if (regAVal > regBVal) {
            system.registers.flags.bits[0] = 1
        } else {
            system.registers.flags.bits[0] = 0
        }
    }

    setZFlag(system, regBVal) {
        if (regBVal === 0) {
            system.registers.flags.bits[3] = 1
        } else {
            system.registers.flags.bits[3] = 0
        }
    }

    setAFlag(system, regAVal, regBVal) {
        if (regAVal > regBVal) {
            system.registers.flags.bits[1] = 1
        } else {
            system.registers.flags.bits[1] = 0
        }
    }

    setEFlag(system, regAVal, regBVal) {
        if (regAVal === regBVal) {
            system.registers.flags.bits[2] = 1
        } else {
            system.registers.flags.bits[2] = 0
        }
    }

    toBlock(ws) {
        // TODO: create block
    }
}


export class AddInstruction extends ScottInstruction {
    static get mnemonic() {
        return "ADD"
    }

    static get opCode() {
        return "1000"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel]
        const regAVal = regA.toUnsignedIntValue();
        const regB = system.registers[this.regBLabel]

        system.registers[this.regBLabel].set(regA.add(regB));

        this.setCFlag(system, regAVal, regB.toUnsignedIntValue());
        this.setZFlag(system, regB.toUnsignedIntValue());
    }
}

export class ShiftRightInstruction extends ScottInstruction {
    static get mnemonic() {
        return "SHR"
    }

    static get opCode() {
        return "1001"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        this.setCFlag(system, regA.toUnsignedIntValue());

        system.registers[this.regBLabel].set(regA.shift(-1))

        this.setZFlag(system, regA.toUnsignedIntValue());
    }

    setCFlag(system, regAVal) {
        const regA = Word.fromSignedIntValue(regAVal, 8);
        system.registers.flags.bits[0] = regA.bits[0];
    }
}

export class ShiftLeftInstruction extends ScottInstruction {
    static get mnemonic() {
        return "SHL"
    }

    static get opCode() {
        return "1010"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        this.setCFlag(system, regA.toUnsignedIntValue());

        system.registers[this.regBLabel].set(regA.shift(1))

        this.setZFlag(system, system.registers[this.regBLabel].toUnsignedIntValue());

    }

    setCFlag(system, regA) {
        system.registers.flags.bits[0] = Word.fromSignedIntValue(regA).bits[7]
    }
}

export class NotInstruction extends ScottInstruction {
    static get mnemonic() {
        return "NOT"
    }

    static get opCode() {
        return "1011"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        system.registers[this.regBLabel].set(regA.invert())

        this.setZFlag(system, system.registers[this.regBLabel].toUnsignedIntValue());
    }
}

export class AndInstruction extends ScottInstruction {
    static get mnemonic() {
        return "AND"
    }

    static get opCode() {
        return "1100"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        const regB = system.registers[this.regBLabel];
        system.registers[this.regBLabel].set(regA.and(regB));

        this.setZFlag(system, regB.toUnsignedIntValue());
    }
}

export class OrInstruction extends ScottInstruction {
    static get mnemonic() {
        return "OR"
    }

    static get opCode() {
        return "1101"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        const regB = system.registers[this.regBLabel];
        system.registers[this.regBLabel].set(regA.or(regB));

        this.setZFlag(system, regB.toUnsignedIntValue());
    }
}

export class XorInstruction extends ScottInstruction {
    static get mnemonic() {
        return "XOR"
    }

    static get opCode() {
        return "1110"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        const regB = system.registers[this.regBLabel];
        system.registers[this.regBLabel].set(regA.xor(regB));

        this.setZFlag(system, regB.toUnsignedIntValue());
    }
}

export class CmpInstruction extends ScottInstruction {
    static get mnemonic() {
        return "CMP"
    }

    static get opCode() {
        return "1111"
    }

    executeOn(system) {
        const regA = system.registers[this.regALabel];
        const regAVal = regA.toUnsignedIntValue();

        const regB = system.registers[this.regBLabel];
        const regBVal = regB.toUnsignedIntValue();

        this.setAFlag(system, regAVal, regBVal);
        this.setEFlag(system, regAVal, regBVal);
    }
}

export class LoadInstruction extends ScottInstruction {
    static get mnemonic() {
        return "LD"
    }

    static get opCode() {
        return "0000"
    }

    executeOn(system) {
        const regAVal = system.registers[this.regALabel].toUnsignedIntValue();
        const memoryWord = system.memory[regAVal].value
        system.registers[this.regBLabel].set(memoryWord);
    }
}

export class StoreInstruction extends ScottInstruction {
    static get mnemonic() {
        return "ST"
    }

    static get opCode() {
        return "0001"
    }

    executeOn(system) {
        const regAVal = system.registers[this.regALabel].toUnsignedIntValue();
        const regB = system.registers[this.regBLabel];
        system.memory[regAVal].value.set(regB)
    }
}

export class DataInstruction extends ScottInstruction {
    static get mnemonic() {
        return "DATA"
    }

    static get opCode() {
        return "0010"
    }

    get regALabel() {
        return "";
    }

    get regBLabel() {
        return this.args[0];
    }

    get immediate() {
        return this.args[1];
    }

    static fromMachineCode(instWord, immediateWord) {
        const regB = `R${parseInt(instWord.value.toBitString().slice(6, 8), 2)}`
        const immediate = immediateWord.value.toUnsignedIntValue().toString();

        return new this([regB, immediate]);
    }

    executeOn(system) {
        const immediateVal = parseInt(this.immediate);
        system.registers[this.regBLabel].set(Word.fromSignedIntValue(immediateVal, 8));
    }
}

export class JumpRegisterInstruction extends ScottInstruction {
    static get mnemonic() {
        return "JMPR"
    }

    static get opCode() {
        return "0011"
    }

    get regALabel() {
        return "";
    }

    get regBLabel() {
        return this.args[0]
    }

    static fromMachineCode(instWord, immediateWord) {
        const regB = `R${parseInt(instWord.value.toBitString().slice(6, 8), 2)}`

        return new this([regB]);
    }

    executeOn(system) {
        const nextInstructionAddress = system.registers[this.regBLabel].toUnsignedIntValue();
        system.registers.pc.set(Word.fromSignedIntValue(nextInstructionAddress - 1, 8));
    }
}

export class JumpAddressInstruction extends ScottInstruction {
    static get mnemonic() {
        return "JMP"
    }

    static get opCode() {
        return "0100"
    }

    get regALabel() {
        return "";
    }

    get regBLabel() {
        return "";
    }

    get immediate() {
        return this.args[0]
    }

    static fromMachineCode(instWord, immediateWord) {
        const immediate = `${parseInt(immediateWord.value.toBitString(), 2)}`
        return new this([immediate]);
    }

    executeOn(system) {
        const nextInstructionAddress = Number(this.immediate);
        system.registers.pc.set(Word.fromSignedIntValue(nextInstructionAddress - 2, 8));
    }
}

class ConditionalJumpInstruction extends ScottInstruction {
    static get opCode() {
        return "0101"
    }

    static get argLayout() {
        return ['immediate']
    }

    static get conditionCode() {
        return "0000"
    }

    get regALabel() {
        return "";
    }

    get regBLabel() {
        return "";
    }

    get immediate() {
        return this.args[0]
    }

    static fromMachineCode(instWord, immediateWord) {
        const conditionCode = instWord.value.toBitString().slice(4, 8);
        const instClass = conditionalJumpClasses.filter(c => c.conditionCode === conditionCode)[0];

        if (!instClass) {
            throw new Error(`No conditional jump instruction found for conditionCode "${conditionCode}".`);
        }

        const immediate = immediateWord.value.toUnsignedIntValue().toString();

        return new instClass([immediate]);
    }

    toMachineCode() {
        const encodedImmediate = Number(this.immediate).toString(2).padStart(8, "0");
        return `${this.constructor.opCode}${this.constructor.conditionCode}${encodedImmediate}`;
    }

    executeOn(system) {
        if (this.evaluateCondition(system)) {
            system.registers.pc.set(Word.fromSignedIntValue(Number(this.immediate) - 2, 8));
        }
    }

    evaluateCondition(system) {
        return true;
    }
}

export class JumpIfCarryInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JC"
    }

    static get conditionCode() {
        return "1000";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1;
    }
}

export class JumpIfALargerInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JA"
    }

    static get conditionCode() {
        return "0100";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === 1;
    }
}

export class JumpIfEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JE"
    }

    static get conditionCode() {
        return "0010";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[2] === 1;
    }
}

export class JumpIfZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JZ"
    }

    static get conditionCode() {
        return "0001";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfCarryOrALargerInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCA"
    }

    static get conditionCode() {
        return "1100";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1 || system.registers.flags.bits[1] === 1;
    }
}

export class JumpIfCarryOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCE"
    }

    static get conditionCode() {
        return "1010";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1 || system.registers.flags.bits[2] === 1;
    }
}

export class JumpIfCarryOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCZ"
    }

    static get conditionCode() {
        return "1001";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1 || system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfALargerOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAE"
    }

    static get conditionCode() {
        return "0110";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === 1 || system.registers.flags.bits[2] === 1;
    }
}

export class JumpIfALargerOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAZ"
    }

    static get conditionCode() {
        return "0101";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === 1 ||
            system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JEZ"
    }

    static get conditionCode() {
        return "0011";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[2] === 1
            || system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfCarryALargerOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAE"
    }

    static get conditionCode() {
        return "1110";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1
            || system.registers.flags.bits[1] === 1
            || system.registers.flags.bits[2] === 1;
    }
}

export class JumpIfCarryALargerOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAZ"
    }

    static get conditionCode() {
        return "1101";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1
            || system.registers.flags.bits[1] === 1
            || system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfCarryEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCEZ"
    }

    static get conditionCode() {
        return "1011";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === 1
            || system.registers.flags.bits[2] === 1
            || system.registers.flags.bits[3] === 1;
    }
}

export class JumpIfALargerEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAEZ"
    }

    static get conditionCode() {
        return "0111";
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === 1
            || system.registers.flags.bits[2] === 1
            || system.registers.flags.bits[3] === 1;
    }
}


export class JumpIfCarryALargerEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAEZ"
    }

    static get conditionCode() {
        return "1111";
    }

    evaluateCondition(system) {
        return system.registers.flags.toBitString() !== "0000";
    }
}


export class ClearFlagsInstruction extends ScottInstruction {
    static get mnemonic() {
        return "CLF"
    }

    static get opCode() {
        return "0110"
    }

    static fromMachineCode(instWord, immediateWord) {
        return new this()
    }

    toMachineCode() {
        return `${this.constructor.opCode}` + "0000";
    }

    executeOn(system) {
        system.registers.flags.set(Word.fromString("0000", 4));
    }
}

export const instructionClasses = [
    AddInstruction,
    ShiftLeftInstruction,
    ShiftRightInstruction,
    NotInstruction,
    AndInstruction,
    OrInstruction,
    XorInstruction,
    CmpInstruction,
    LoadInstruction,
    StoreInstruction,
    DataInstruction,
    JumpRegisterInstruction,
    JumpAddressInstruction,
    ConditionalJumpInstruction,
    ClearFlagsInstruction,
]

export const conditionalJumpClasses = [
    JumpIfCarryInstruction,
    JumpIfALargerInstruction,
    JumpIfEqualInstruction,
    JumpIfZeroInstruction,
    JumpIfCarryOrALargerInstruction,
    JumpIfCarryOrEqualInstruction,
    JumpIfCarryOrZeroInstruction,
    JumpIfALargerOrEqualInstruction,
    JumpIfALargerOrZeroInstruction,
    JumpIfEqualOrZeroInstruction,
    JumpIfCarryALargerOrEqualInstruction,
    JumpIfCarryALargerOrZeroInstruction,
    JumpIfCarryEqualOrZeroInstruction,
    JumpIfALargerEqualOrZeroInstruction,
    JumpIfCarryALargerEqualOrZeroInstruction,
]

export const allInstructionClasses = instructionClasses.concat(conditionalJumpClasses);