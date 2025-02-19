import {BaseInstruction} from "@/architectures/instructions.js";

export class ScottInstructionFactory {
    createFromMnemonic(mnemonic, args) {

    }


    createFromOpCode(memory, address) {

    }
}

class ScottInstruction extends BaseInstruction {
    static fromMachineCode(instWord, immediateWord) {
        const regA = `R${parseInt(instWord.slice(4, 6))}`
        const regB = `R${parseInt(instWord.slice(6, 8))}`

        return new this([regA, regB]);
    }

    toString() {
        return `${this.constructor.mnemonic} ${this.args.join(", ")}`;
    }

    toMachineCode() {
        let regACode = Number(this.args[0][1]).toString(2);
        let regBCode = Number(this.args[1][1]).toString(2);

        return `${this.constructor.opCode}${regACode}${regBCode}}`;
    }
}


export class AddInstruction extends ScottInstruction {
    static get mnemonic() {
        return "add"
    }

    static get opCode() {
        return "1000"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class ShiftRightInstruction extends ScottInstruction {
    static get mnemonic() {
        return "shr"
    }

    static get opCode() {
        return "1001"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class ShiftLeftInstruction extends ScottInstruction {
    static get mnemonic() {
        return "shl"
    }

    static get opCode() {
        return "1010"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class NotInstruction extends ScottInstruction {
    static get mnemonic() {
        return "not"
    }

    static get opCode() {
        return "1011"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class AndInstruction extends ScottInstruction {
    static get mnemonic() {
        return "and"
    }

    static get opCode() {
        return "1100"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class OrInstruction extends ScottInstruction {
    static get mnemonic() {
        return "or"
    }

    static get opCode() {
        return "1101"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class XorInstruction extends ScottInstruction {
    static get mnemonic() {
        return "xor"
    }

    static get opCode() {
        return "1110"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class CmpInstruction extends ScottInstruction {
    static get mnemonic() {
        return "cmp"
    }

    static get opCode() {
        return "1111"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class LoadInstruction extends ScottInstruction {
    static get mnemonic() {
        return "ld"
    }

    static get opCode() {
        return "0000"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class StoreInstruction extends ScottInstruction {
    static get mnemonic() {
        return "st"
    }

    static get opCode() {
        return "0001"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class DataInstruction extends ScottInstruction {
    static get mnemonic() {
        return "data"
    }

    static get opCode() {
        return "0010"
    }

    static fromMachineCode(instWord, immediateWord) {
        const regA = `R${parseInt(instWord.slice(4, 6))}`
        const regB = `R${parseInt(instWord.slice(6, 8))}`

        return this.constructor([regA, regB]);
    }

    toMachineCode() {
        let regBCode = Number(this.args[0][1]).toString(2);
        let binaryImmediate = Number(this.args[1]).toString(2).padStart(8, "0")
        return `${this.constructor.opCode}00${regBCode}}` + binaryImmediate;
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class JumpRegisterInstruction extends ScottInstruction {
    static get mnemonic() {
        return "jmpr"
    }

    static get opCode() {
        return "0011"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class JumpInstruction extends ScottInstruction {
    static get mnemonic() {
        return "jmp"
    }

    static get opCode() {
        return "0100"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
    }
}

class ConditionalJumpInstruction extends ScottInstruction {
    static get opCode() {
        return "0101"
    }

    static get argLayout() {
        return ['immediate']
    }

    executeOn(system) {
        if (this.evaluateCondition(system)) {
            system.registers.pc = this.immediate
        }
    }

    evaluateCondition(system) {
        return true;
    }

    toBlock(ws) {
        // TODO: create block
    }
}

export class JumpIfCarryInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JC"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1";
    }
}

export class JumpIfALargerInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JA"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === "1";
    }
}

export class JumpIfEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JE"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[2] === "1";
    }
}

export class JumpIfZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfCarryOrALargerInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCA"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1" || system.registers.flags.bits[1] === "1";
    }
}

export class JumpIfCarryOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCE"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1" || system.registers.flags.bits[2] === "1";
    }
}

export class JumpIfCarryOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1" || system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfALargerOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAE"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === "1" || system.registers.flags.bits[2] === "1";
    }
}

export class JumpIfALargerOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === "1" ||
            system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JEZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[2] === "1"
            || system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfCarryALargerOrEqualInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAE"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1"
            || system.registers.flags.bits[1] === "1"
            || system.registers.flags.bits[2] === "1";
    }
}

export class JumpIfCarryALargerOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1"
            || system.registers.flags.bits[1] === "1"
            || system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfCarryEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCEZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[0] === "1"
            || system.registers.flags.bits[2] === "1"
            || system.registers.flags.bits[3] === "1";
    }
}

export class JumpIfALargerEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JAEZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.bits[1] === "1"
            || system.registers.flags.bits[2] === "1"
            || system.registers.flags.bits[3] === "1";
    }
}


export class JumpIfCarryALargerEqualOrZeroInstruction extends ConditionalJumpInstruction {
    static get mnemonic() {
        return "JCAEZ"
    }

    evaluateCondition(system) {
        return system.registers.flags.toString() !== "0000";
    }
}


export class ClearFlagsInstruction extends ScottInstruction {
    static get mnemonic() {
        return "clf"
    }

    static get opCode() {
        return "0110"
    }

    executeOn(system) {
        // TODO: execute instruction behaviour
    }

    toBlock(ws) {
        // TODO: create block
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
    JumpInstruction,
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
    ClearFlagsInstruction,
]