import {BaseInstruction} from "@/architectures/instructions.js";
import {Word} from "@/architectures/system.js";

const intToOpCode = (number) => {
    return Number(number).toString(2).padStart(6, '0')
}

const regToBinary = (reg) => Number(reg[1]).toString(2).padStart(3, '0');

const containsImmediate = (args) => {
    if (args.length === 0) {
        return false;
    }

    return !(args.at(-1).startsWith('$'));
}

export class ArmletInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        if (containsImmediate(args)) {
            let instructionClass = this.getImmediateInstructionClassByMnemonic(mnemonic);
            return new instructionClass(args);
        }
        let instructionClass = this.getRegisterInstructionClassByMnemonic(mnemonic);
        return new instructionClass(args);
    }

    getRegisterInstructionClassByMnemonic(mnemonic) {
        return instructionClasses.filter((c) => c.mnemonic === mnemonic)[0];
    }

    getImmediateInstructionClassByMnemonic(mnemonic) {
        return immediateInstructionClasses.filter((c) => c.mnemonic === mnemonic)[0];
    }

    createFromOpCode(memory, address) {
        let instWord = memory[address].toBitString()

        let instructionClass = this.getInstructionClassByOpCode(instWord.slice(10, 16));

        if (address + 1 >= memory.length) {
            return instructionClass.fromMachineCode(instWord, Word.fromSignedIntValue(0));
        }

        let immediateWord = memory[address + 1].toBitString()
        return instructionClass.fromMachineCode(instWord, immediateWord);

    }

    getInstructionClassByOpCode(opCode) {
        let result = instructionClasses.filter((c) => c.opCode === opCode);

        if (result.length === 0) {
            result = immediateInstructionClasses.filter((c) => c.opCode === opCode);

            if (result.length === 0) {
                return HltInstruction;
            }
        }

        return result[0];
    }
}

export class AbstractArmletInstruction extends BaseInstruction {

    get destination() {
        if (!this.args || this.args.length < 1 || !this.args[0].startsWith('$')) {
            return "$0"
        }

        return this.args[0];
    }

    get firstOperand() {
        if (!this.args || this.args.length < 2 || !this.args[1].startsWith('$')) {
            return "$0"
        }

        return this.args[1];
    }

    get secondOperand() {
        if (!this.args || this.args.length < 3 || !this.args[2].startsWith('$')) {
            return "$0"
        }

        return this.args[2];
    }

    get immediate() {
        let lastArg = this.args.at(-1)

        if (lastArg && !lastArg.startsWith('$')) {
            return lastArg
        }

        return ""
    }

    static extractL(code) {
        return `$${parseInt(code.slice(7, 10), 2)}`;
    }

    static extractA(code) {
        return `$${parseInt(code.slice(4, 7), 2)}`;
    }

    static extractB(code) {
        return `$${parseInt(code.slice(1, 4), 2)}`;
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)
        let b = this.extractB(code)

        return new this([l, a, b])
    }

    toMachineCode() {
        let l = regToBinary(this.destination)
        let a = regToBinary(this.firstOperand)
        let b = regToBinary(this.secondOperand)

        return "0" + b + a + l + this.constructor.opCode
    }


    toString() {
        let cmd = this.constructor.mnemonic
        if (this.args.length > 0) {
            cmd = cmd + " " + this.args.join(", ")
        }

        return cmd
    }

}

export class AbstractImmediateArmletInstruction extends AbstractArmletInstruction {
    static fromMachineCode(instWord, immediateWord) {
        let l = this.extractL(instWord)
        let a = this.extractA(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([l, a, immediate])
    }

    toMachineCode() {
        let l = regToBinary(this.destination)
        let a = regToBinary(this.firstOperand)
        let b = "000"
        let binaryImmediate = Number(this.immediate).toString(2).padStart(16, '0')

        return "0" + b + a + l + this.constructor.opCode + binaryImmediate
    }

    executeOn(system) {
        system.registers.pc = system.registers.pc.addImmedate(1)
    }
}

export class AbstractArmletControlInstruction extends AbstractArmletInstruction {
    get destination() {
        return '$0';
    }

    get firstOperand() {
        if (!this.args || this.args.length < 1 || !this.args[0].startsWith('$')) {
            return "$0"
        }

        return this.args[0];
    }

    get secondOperand() {
        return '$0';
    }

    static fromMachineCode(code) {
        let a = this.extractA(code)

        return new this([a])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.firstOperand)
        let b = "000"

        return "0" + b + a + l + this.constructor.opCode
    }

    getJmpTarget(system) {
        return system.registers[this.firstOperand].addImmedate(-1)
    }
}

export class AbstractArmletImmediateControlInstruction extends AbstractImmediateArmletInstruction {
    get destination() {
        return '$0';
    }

    get firstOperand() {
        return '$0'
    }

    get secondOperand() {
        return '$0';
    }

    static fromMachineCode(instWord, immediateWord) {
        let immediate = `${parseInt(immediateWord, 2)}`
        return new this([immediate])
    }

    toMachineCode() {
        let l = "000"
        let a = "000"
        let b = "000"
        let binaryImmediate = Number(this.immediate).toString(2).padStart(16, '0')

        return "0" + b + a + l + this.constructor.opCode + binaryImmediate
    }

    getJmpTarget(system) {
        let immediateAddress = system.registers.pc.toUnsignedIntValue() + 1
        let immediate = system.memory[immediateAddress]
        return immediate.addImmedate(-1)
    }
}

export class NopInstruction extends AbstractArmletInstruction {

    constructor() {
        super([]);
    }

    static get mnemonic() {
        return "nop"
    }

    static get opCode() {
        return intToOpCode(0)
    }

    static fromMachineCode(instWord, immediateWord) {
        return new NopInstruction();
    }

    executeOn(system) {
        // Do nothing
    }

    toString() {
        return NopInstruction.mnemonic;
    }
}

export class MovInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "mov"
    }

    static get opCode() {
        return intToOpCode(1)
    }

    static fromMachineCode(instWord, immediateWord) {
        return new MovInstruction([this.extractL(instWord), this.extractA(instWord)]);
    }

    executeOn(system) {
        let targetReg = system.registers[this.destination];
        let sourceReg = system.registers[this.firstOperand];
        targetReg.set(sourceReg);
    }
}

export class MovImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "mov"
    }

    static get opCode() {
        return intToOpCode(26)
    }

    static fromMachineCode(instWord, immediateWord) {
        let l = this.extractL(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([l, immediate])
    }

    executeOn(system) {
        let targetReg = system.registers[this.destination];
        let immediate = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]
        system.registers['pc'].addImmedate(1)

        targetReg.set(immediate);
    }
}

export class AndInstruction extends AbstractArmletInstruction {

    static get mnemonic() {
        return "and"
    }

    static get opCode() {
        return intToOpCode(2)
    }

    static fromMachineCode(code) {
        return new AndInstruction([this.extractL(code), this.extractA(code), this.extractB(code)]);
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.registers[this.secondOperand]

        let result = firstOp.and(secondOp)
        dest.set(result)
    }
}

export class AndImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "and"
    }

    static get opCode() {
        return intToOpCode(27)
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]

        let result = firstOp.and(secondOp)
        dest.set(result)
    }
}

export class IorInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "ior"
    }

    static get opCode() {
        return intToOpCode(3)
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.registers[this.secondOperand]

        let result = firstOp.or(secondOp)
        dest.set(result)
    }
}

export class IorImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "ior"
    }

    static get opCode() {
        return intToOpCode(28)
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]

        let result = firstOp.or(secondOp)
        dest.set(result)
    }
}

export class EorInstruction extends AbstractArmletInstruction {

    static get mnemonic() {
        return "eor"
    }

    static get opCode() {
        return intToOpCode(4)
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.registers[this.secondOperand]

        let result = firstOp.xor(secondOp)
        dest.set(result)
    }
}

export class EorImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "eor"
    }

    static get opCode() {
        return intToOpCode(29)
    }

    executeOn(system) {
        let dest = system.registers[this.destination]
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]
        let result = firstOp.xor(secondOp)
        dest.set(result)
    }
}

export class NotInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "not"
    }

    static get opCode() {
        return intToOpCode(5)
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    executeOn(system) {
        let destReg = system.registers[this.destination]
        let firstOpReg = system.registers[this.firstOperand]

        destReg.set(firstOpReg.invert())
    }
}

export class AddInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "add"
    }

    static get opCode() {
        return intToOpCode(6)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpReg = system.registers[this.secondOperand];

        let result = firstOpReg.add(secondOpReg);
        destReg.set(result);
    }
}

export class AddImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "add"
    }

    static get opCode() {
        return intToOpCode(30)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpReg = system.memory[system.registers['pc'].toUnsignedIntValue() + 1];

        let result = firstOpReg.add(secondOpReg);
        destReg.set(result);
    }
}

export class SubInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "sub"
    }

    static get opCode() {
        return intToOpCode(7)
    }


    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpReg = system.registers[this.secondOperand];

        let twoCompliment = secondOpReg.invert().addImmedate(1)

        let result = firstOpReg.add(twoCompliment);
        destReg.set(result);
    }
}

export class SubImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "sub"
    }

    static get opCode() {
        return intToOpCode(31)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpReg = system.memory[system.registers['pc'].toUnsignedIntValue() + 1];

        let twoCompliment = secondOpReg.invert().addImmedate(1)

        let result = firstOpReg.add(twoCompliment);
        destReg.set(result);
    }
}

export class NegInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "neg"
    }

    static get opCode() {
        return intToOpCode(8)
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }


    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];

        let negVal = firstOpReg.invert().addImmedate(1);
        destReg.set(negVal);
    }
}

export class LslInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "lsl"
    }

    static get opCode() {
        return intToOpCode(9)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination]
        let firstOpReg = system.registers[this.firstOperand]
        let secondOpVal = system.registers[this.secondOperand].toUnsignedIntValue()

        let result = firstOpReg.shift(secondOpVal)
        destReg.set(result)
    }
}

export class LslImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "lsl"
    }

    static get opCode() {
        return intToOpCode(32)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination]
        let firstOpReg = system.registers[this.firstOperand]
        let secondOpVal = system.memory[system.registers['pc'].toUnsignedIntValue() + 1].toUnsignedIntValue()

        let result = firstOpReg.shift(secondOpVal)
        destReg.set(result)
    }
}

export class LsrInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "lsr"
    }

    static get opCode() {
        return intToOpCode(10)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpVal = system.registers[this.secondOperand].toUnsignedIntValue();

        let result = firstOpReg.shift(-secondOpVal);
        destReg.set(result);
    }
}

export class LsrImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "lsr"
    }

    static get opCode() {
        return intToOpCode(33)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpVal = system.memory[system.registers['pc'].toUnsignedIntValue() + 1].toUnsignedIntValue();

        let result = firstOpReg.shift(-secondOpVal);
        destReg.set(result);
    }
}

export class AsrInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "asr"
    }

    static get opCode() {
        return intToOpCode(11)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpVal = system.registers[this.secondOperand].toSignedIntValue();

        let result = firstOpReg.arithmeticShift(-secondOpVal);

        destReg.set(result);
    }
}

export class AsrImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "asr"
    }

    static get opCode() {
        return intToOpCode(34)
    }

    executeOn(system) {
        let destReg = system.registers[this.destination];
        let firstOpReg = system.registers[this.firstOperand];
        let secondOpVal = system.memory[system.registers['pc'].toUnsignedIntValue() + 1].toUnsignedIntValue();

        let result = firstOpReg.arithmeticShift(-secondOpVal);

        destReg.set(result);
    }
}

export class LoaInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "loa"
    }

    static get opCode() {
        return intToOpCode(12)
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    toMachineCode() {
        let l = regToBinary(this.destination)
        let a = regToBinary(this.firstOperand)

        return "0" + "000" + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let idx = system.registers[this.firstOperand].toUnsignedIntValue()
        system.registers[this.destination].set(system.memory[idx])
    }
}

export class StoInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "sto"
    }

    static get opCode() {
        return intToOpCode(13)
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    toMachineCode() {
        let l = regToBinary(this.destination)
        let a = regToBinary(this.firstOperand)

        return "0" + "000" + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let idx = system.registers[this.destination].toUnsignedIntValue()
        system.memory[idx].set(system.registers[this.firstOperand])
    }
}

export class CmpInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "cmp"
    }

    static get opCode() {
        return intToOpCode(14)
    }

    get destination() {
        return '$0';
    }

    get firstOperand() {
        if (!this.args || this.args.length < 1 || !this.args[0].startsWith('$')) {
            return "$0"
        }

        return this.args[0];
    }

    get secondOperand() {
        if (!this.args || this.args.length < 2 || !this.args[1].startsWith('$')) {
            return "$0"
        }

        return this.args[1];
    }

    static fromMachineCode(code) {
        let a = this.extractA(code)
        let b = this.extractB(code)

        return new this([a, b])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.firstOperand)
        let b = regToBinary(this.secondOperand)

        return "0" + b + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let firstOp = system.registers[this.firstOperand]
        let secondOp = system.registers[this.secondOperand]

        let result = Word.fromSignedIntValue(0)

        if (firstOp.toBitString() === secondOp.toBitString()) {
            result.bits[0] = 1;
        }

        if (firstOp.toSignedIntValue() > secondOp.toSignedIntValue()) {
            result.bits[1] = 1;
        }

        if (firstOp.toUnsignedIntValue() > secondOp.toUnsignedIntValue()) {
            result.bits[2] = 1;
        }

        system.registers['status'].set(result)
    }
}

export class CmpImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get mnemonic() {
        return "cmp"
    }

    static get opCode() {
        return intToOpCode(35)
    }

    get destination() {
        return '$0';
    }

    get firstOperand() {
        if (!this.args || this.args.length < 1 || !this.args[0].startsWith('$')) {
            return "$0"
        }

        return this.args[0];
    }

    get secondOperand() {
        return '$0';
    }

    static fromMachineCode(instWord, immediateWord) {
        let a = this.extractA(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([a, immediate])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.firstOperand)
        let b = "000"
        let binaryImmediate = Number(this.immediate).toString(2).padStart(16, '0')

        return "0" + b + a + l + this.constructor.opCode + binaryImmediate
    }

    executeOn(system) {
        let firstOp = system.registers[this.firstOperand]
        let immediate = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]

        let result = Word.fromSignedIntValue(0)

        if (firstOp.toBitString() === immediate.toBitString()) {
            result.bits[0] = 1;
        }

        if (firstOp.toSignedIntValue() > immediate.toSignedIntValue()) {
            result.bits[1] = 1;
        }

        if (firstOp.toUnsignedIntValue() > immediate.toUnsignedIntValue()) {
            result.bits[2] = 1;
        }

        system.registers['status'].set(result)
    }
}

export class JmpInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "jmp"
    }

    static get opCode() {
        return intToOpCode(15)
    }

    executeOn(system) {
        system.registers['pc'].set(this.getJmpTarget(system))
    }
}

export class JmpImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "jmp"
    }

    static get opCode() {
        return intToOpCode(36)
    }

    executeOn(system) {
        system.registers['pc'].set(this.getJmpTarget(system))
    }
}

export class BeqInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "beq";
    }

    static get opCode() {
        return intToOpCode(16);
    }

    executeOn(system) {
        if (system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }

}

export class BeqImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "beq";
    }

    static get opCode() {
        return intToOpCode(37);
    }

    executeOn(system) {
        if (system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BneInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bne";
    }

    static get opCode() {
        return intToOpCode(17);
    }

    executeOn(system) {
        if (!system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BneImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bne";
    }

    static get opCode() {
        return intToOpCode(38);
    }

    executeOn(system) {
        if (!system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BgtInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bgt";
    }

    static get opCode() {
        return intToOpCode(18);
    }

    executeOn(system) {
        if (system.isGtFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BgtImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bgt";
    }

    static get opCode() {
        return intToOpCode(39);
    }

    executeOn(system) {
        if (system.isGtFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BltInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "blt";
    }

    static get opCode() {
        return intToOpCode(19);
    }

    executeOn(system) {
        if (!(system.isGtFlagSet || system.isEqFlagSet)) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BltImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "blt";
    }

    static get opCode() {
        return intToOpCode(40);
    }

    executeOn(system) {
        if (!(system.isGtFlagSet || system.isEqFlagSet)) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }

}

export class BgeInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bge";
    }

    static get opCode() {
        return intToOpCode(20);
    }

    executeOn(system) {
        if (system.isGtFlagSet || system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BgeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bge";
    }

    static get opCode() {
        return intToOpCode(41);
    }

    executeOn(system) {
        if (system.isGtFlagSet || system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BleInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "ble";
    }

    static get opCode() {
        return intToOpCode(21);
    }

    executeOn(system) {
        if (!system.isGtFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BleImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "ble";
    }

    static get opCode() {
        return intToOpCode(42);
    }

    executeOn(system) {
        if (!system.isGtFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BabInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bab";
    }

    static get opCode() {
        return intToOpCode(22);
    }

    executeOn(system) {
        if (system.isAbFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BabImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bab";
    }

    static get opCode() {
        return intToOpCode(43);
    }

    executeOn(system) {
        if (system.isAbFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BbwInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bbw";
    }

    static get opCode() {
        return intToOpCode(23);
    }

    executeOn(system) {
        if (!(system.isAbFlagSet || system.isEqFlagSet)) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BbwImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bbw";
    }

    static get opCode() {
        return intToOpCode(44);
    }

    executeOn(system) {
        if (!(system.isAbFlagSet || system.isEqFlagSet)) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BaeInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bae";
    }

    static get opCode() {
        return intToOpCode(24);
    }

    executeOn(system) {
        if (system.isAbFlagSet || system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BaeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bae";
    }

    static get opCode() {
        return intToOpCode(45);
    }

    executeOn(system) {
        if (system.isAbFlagSet || system.isEqFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BbeInstruction extends AbstractArmletControlInstruction {
    static get mnemonic() {
        return "bbe";
    }

    static get opCode() {
        return intToOpCode(25);
    }

    executeOn(system) {
        if (!system.isAbFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class BbeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    static get mnemonic() {
        return "bbe";
    }

    static get opCode() {
        return intToOpCode(46);
    }

    executeOn(system) {
        if (!system.isAbFlagSet) {
            system.registers['pc'].set(this.getJmpTarget(system))
        }
    }
}

export class TrpInstruction extends AbstractArmletInstruction {
    constructor() {
        super([]);
    }

    static get mnemonic() {
        return "trp"
    }

    static get opCode() {
        return intToOpCode(62)
    }

    static fromMachineCode(instWord, immediateWord) {
        return new TrpInstruction();
    }

    executeOn(system) {
        system.callInterrupt('alert', 'Execution paused!');
        system.pauseExecution()
    }
}

export class HltInstruction extends AbstractArmletInstruction {
    constructor() {
        super([]);
    }

    static get mnemonic() {
        return "hlt";
    }

    static get opCode() {
        return intToOpCode(63);
    }

    executeOn(system) {
        system.callInterrupt("hlt");
    }
}

const instructionClasses = [
    NopInstruction,
    MovInstruction,
    AndInstruction,
    IorInstruction,
    EorInstruction,
    NotInstruction,
    AddInstruction,
    SubInstruction,
    NegInstruction,
    LslInstruction,
    LsrInstruction,
    AsrInstruction,
    LoaInstruction,
    StoInstruction,
    CmpInstruction,
    JmpInstruction,
    BeqInstruction,
    BneInstruction,
    BgtInstruction,
    BltInstruction,
    BgeInstruction,
    BleInstruction,
    BabInstruction,
    BbwInstruction,
    BaeInstruction,
    BbeInstruction,
    TrpInstruction,
    HltInstruction,
];

const immediateInstructionClasses = [
    MovImmediateInstruction,
    AndImmediateInstruction,
    IorImmediateInstruction,
    EorImmediateInstruction,
    AddImmediateInstruction,
    SubImmediateInstruction,
    LslImmediateInstruction,
    LsrImmediateInstruction,
    AsrImmediateInstruction,
    CmpImmediateInstruction,
    JmpImmediateInstruction,
    BeqImmediateInstruction,
    BneImmediateInstruction,
    BgtImmediateInstruction,
    BltImmediateInstruction,
    BgeImmediateInstruction,
    BleImmediateInstruction,
    BabImmediateInstruction,
    BbwImmediateInstruction,
    BaeImmediateInstruction,
    BbeImmediateInstruction,
];