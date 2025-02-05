import {BaseInstruction, PseudoInstruction} from "@/architectures/instructions.js";
import {Word} from "@/architectures/system.js";
import {addressSize} from "@/architectures/armlet/system.js";

const intToOpCode = (number) => {
    return Number(number).toString(2).padStart(6, '0')
}

const regToBinary = (reg) => {
    if (!reg) {
        return "000";
    }
    return Number(reg[1]).toString(2).padStart(3, '0');
}

const containsImmediate = (args) => {
    if (args.length === 0) {
        return false;
    }

    return !(args.at(-1).startsWith('$'));
}

export class ArmletInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        let pseudoInstructionClass = this.getPseudoInstructionClassByMnemonic(mnemonic);

        if (pseudoInstructionClass) {
            return new pseudoInstructionClass(args);
        }

        if (containsImmediate(args)) {
            let instructionClass = this.getImmediateInstructionClassByMnemonic(mnemonic);
            return new instructionClass(args);
        }
        let instructionClass = this.getRegisterInstructionClassByMnemonic(mnemonic);
        return new instructionClass(args);
    }

    getRegisterInstructionClassByMnemonic(mnemonic) {
        let result = instructionClasses.filter(c => c.mnemonic === mnemonic);

        if (result.len < 0) {
            return null;
        }

        return result[0]
    }

    getImmediateInstructionClassByMnemonic(mnemonic) {
        return immediateInstructionClasses.filter(c => c.mnemonic === mnemonic)[0];
    }

    getPseudoInstructionClassByMnemonic(mnemonic) {
        return pseudoInstructionClasses.filter(c => c.mnemonic === mnemonic)[0];
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

export class DataDirective extends PseudoInstruction {
    static get mnemonic() {
        return "%data"
    }

    toString() {
        return `${this.constructor.mnemonic} ${this.args.join(", ")}`
    }

    toMachineCode() {
        return this.args.map(arg => Number(arg))
            .map(arg => Word.fromSignedIntValue(arg, addressSize).toBitString())
            .join('')
    }

    toBlock(ws) {


        if (this.args.length === 0) {
            return null;
        }

        if (this.args.length === 1) {
            let dataWord = ws.newBlock('decimalWord')
            dataWord.initSvg()
            dataWord.setFieldValue(this.args[0], 'data')
            return dataWord
        }

        let dataWordsBlock = ws.newBlock('data')
        dataWordsBlock.initSvg()

        let wordData = ws.newBlock('decimalWord')
        wordData.initSvg();
        wordData.getField('data').setValue(this.args[0]);
        dataWordsBlock.getInput('dataWords').connection.connect(wordData.previousConnection);

        for (let arg of this.args.slice(1)) {
            let nextWord = ws.newBlock('decimalWord');
            nextWord.initSvg()
            nextWord.getField('data').setValue(arg);
            nextWord.previousConnection.connect(wordData.nextConnection);

            wordData = nextWord;
        }

        dataWordsBlock.setCollapsed(true);
        return dataWordsBlock;
    }
}

export class MultilineComment {
    constructor(text) {
        this.text = text;
    }

    toString() {
        return this.text;
    }

    toMachineCode() {
        return "";
    }

    toBlock(ws) {
        let multilineCommentBlock = ws.newBlock('comment')
        multilineCommentBlock.initSvg()
        multilineCommentBlock.getField('text').setValue(this.text);

        multilineCommentBlock.setCollapsed(true);
        return multilineCommentBlock
    }
}

export class AbstractArmletInstruction extends BaseInstruction {

    get lArgument() {
        const lPos = this.constructor.argumentLayout.indexOf('L')

        if (lPos < 0) {
            return null;
        }

        return this.args[lPos]
    }

    get aArgument() {
        const aPos = this.constructor.argumentLayout.indexOf('A')

        if (aPos < 0) {
            return null;
        }

        return this.args[aPos]
    }

    get bArgument() {
        const bPos = this.constructor.argumentLayout.indexOf('B')

        if (bPos < 0) {
            return null;
        }

        return this.args[bPos]
    }

    get immediate() {
        const iPos = this.constructor.argumentLayout.indexOf('I')

        if (iPos < 0) {
            return null;
        }

        return this.args[iPos]
    }

    get blockType() {
        return this.constructor.mnemonic
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
        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)
        let b = regToBinary(this.bArgument)

        return "0" + b + a + l + this.constructor.opCode
    }

    toString() {
        let cmd = this.constructor.mnemonic
        if (this.args.length > 0) {
            cmd = cmd + " " + this.args.join(", ")
        }

        if (this.comment) {
            cmd += " # " + this.comment
        }

        return cmd
    }

    toBlock(ws) {
        let block = ws.newBlock(this.blockType);
        block.initSvg();

        if (this.lArgument) {
            let destinationBlock = ws.newBlock('register');
            destinationBlock.initSvg();
            destinationBlock.getField('value').setValue(Number(this.lArgument[1]))

            let movDestConnection = block.getInput('L').connection;
            movDestConnection.connect(destinationBlock.outputConnection);
        }

        if (this.aArgument) {
            let aBlock = ws.newBlock('register');
            aBlock.initSvg();
            aBlock.getField('value').setValue(Number(this.aArgument[1]));

            let aConnection = block.getInput('A').connection;
            aConnection.connect(aBlock.outputConnection);
        }

        if (this.bArgument) {
            let bBlock = ws.newBlock('register');
            bBlock.initSvg();
            bBlock.getField('value').setValue(Number(this.bArgument[1]));

            let bConnection = block.getInput('B').connection;
            bConnection.connect(bBlock.outputConnection);
        }

        if (this.immediate) {
            let iBlock;

            if (this.immediate.startsWith('>')) {
                iBlock = ws.newBlock('label');
                iBlock.initSvg();
                iBlock.getField('value').setValue(this.immediate.slice(1));
            } else {
                iBlock = ws.newBlock('immediate');
                iBlock.initSvg();
                iBlock.getField('value').setValue(Number(this.immediate));
            }

            if (!this.constructor.argumentLayout.includes('A')) {
                let iConnection = block.getInput('A').connection;
                iConnection.connect(iBlock.outputConnection);
            } else {
                let iConnection = block.getInput('B').connection;
                iConnection.connect(iBlock.outputConnection);
            }
        }

        if (this.comment) {
            block.setCommentText(this.comment);
        }

        return block;
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
        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)
        let b = "000"
        let binaryImmediate = Number(this.immediate).toString(2).padStart(16, '0')

        return "0" + b + a + l + this.constructor.opCode + binaryImmediate
    }

    executeOn(system) {
        system.registers.pc = system.registers.pc.addImmedate(1)
    }
}

export class AbstractArmletControlInstruction extends AbstractArmletInstruction {

    static get argumentLayout() {
        return "A";
    }

    static fromMachineCode(code) {
        let a = this.extractA(code)

        return new this([a])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.aArgument)
        let b = "000"

        return "0" + b + a + l + this.constructor.opCode
    }

    getJmpTarget(system) {
        return system.registers[this.aArgument].addImmedate(-1)
    }
}

export class AbstractArmletImmediateControlInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout() {
        return "I";
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
        return immediate.addImmedate(-2)
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

    static get argumentLayout() {
        return "N";
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

    toBlock(ws) {
        let block = ws.newBlock(NopInstruction.mnemonic);
        block.initSvg();
        return block;
    }
}

export class MovInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "mov"
    }

    static get opCode() {
        return intToOpCode(1)
    }

    static get argumentLayout() {
        return "LA";
    }

    static fromMachineCode(instWord, immediateWord) {
        return new MovInstruction([this.extractL(instWord), this.extractA(instWord)]);
    }

    executeOn(system) {
        let targetReg = system.registers[this.lArgument];
        let sourceReg = system.registers[this.aArgument];
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

    static get argumentLayout() {
        return "LI";
    }

    static fromMachineCode(instWord, immediateWord) {
        let l = this.extractL(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([l, immediate])
    }

    executeOn(system) {
        let targetReg = system.registers[this.lArgument];
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

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "linst"
    }

    static fromMachineCode(code) {
        return new AndInstruction([this.extractL(code), this.extractA(code), this.extractB(code)]);
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
        let secondOp = system.registers[this.bArgument]

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

    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "linst"
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
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

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "linst"
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
        let secondOp = system.registers[this.bArgument]

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

    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "linst"
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
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

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "linst"
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
        let secondOp = system.registers[this.bArgument]

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

    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "linst"
    }

    executeOn(system) {
        let dest = system.registers[this.lArgument]
        let firstOp = system.registers[this.aArgument]
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

    static get argumentLayout() {
        return "LA";
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument]
        let firstOpReg = system.registers[this.aArgument]

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

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "ainst"
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
        let secondOpReg = system.registers[this.bArgument];

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

    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "ainst"
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
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

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "ainst"
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
        let secondOpReg = system.registers[this.bArgument];

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

    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "ainst"
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
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

    static get argumentLayout() {
        return "LA";
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }


    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];

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

    static get argumentLayout() {
        return "LAB";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument]
        let firstOpReg = system.registers[this.aArgument]
        let secondOpVal = system.registers[this.bArgument].toUnsignedIntValue()

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

    static get argumentLayout() {
        return "LAI";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument]
        let firstOpReg = system.registers[this.aArgument]
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

    static get argumentLayout() {
        return "LAB";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
        let secondOpVal = system.registers[this.bArgument].toUnsignedIntValue();

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

    static get argumentLayout() {
        return "LAI";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
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

    static get argumentLayout() {
        return "LAB";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
        let secondOpVal = system.registers[this.bArgument].toSignedIntValue();

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

    static get argumentLayout() {
        return "LAI";
    }

    executeOn(system) {
        let destReg = system.registers[this.lArgument];
        let firstOpReg = system.registers[this.aArgument];
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

    static get argumentLayout() {
        return "LA";
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    toMachineCode() {
        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)

        return "0" + "000" + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let idx = system.registers[this.aArgument].toUnsignedIntValue()
        system.registers[this.lArgument].set(system.memory[idx])
    }
}

export class StoInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "sto"
    }

    static get opCode() {
        return intToOpCode(13)
    }

    static get argumentLayout() {
        return "LA";
    }

    static fromMachineCode(code) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    toMachineCode() {
        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)

        return "0" + "000" + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let idx = system.registers[this.lArgument].toUnsignedIntValue()
        system.memory[idx].set(system.registers[this.aArgument])
    }
}

export class CmpInstruction extends AbstractArmletInstruction {
    static get mnemonic() {
        return "cmp"
    }

    static get opCode() {
        return intToOpCode(14)
    }

    static get argumentLayout() {
        return "AB";
    }

    static fromMachineCode(code) {
        let a = this.extractA(code)
        let b = this.extractB(code)

        return new this([a, b])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.aArgument)
        let b = regToBinary(this.bArgument)

        return "0" + b + a + l + this.constructor.opCode
    }

    executeOn(system) {
        let firstOp = system.registers[this.aArgument]
        let secondOp = system.registers[this.bArgument]

        let result = Word.fromSignedIntValue(0, 3)

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

    static get argumentLayout() {
        return "AI";
    }

    static fromMachineCode(instWord, immediateWord) {
        let a = this.extractA(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([a, immediate])
    }

    toMachineCode() {
        let l = "000"
        let a = regToBinary(this.aArgument)
        let b = "000"
        let binaryImmediate = Number(this.immediate).toString(2).padStart(16, '0')

        return "0" + b + a + l + this.constructor.opCode + binaryImmediate
    }

    executeOn(system) {
        let firstOp = system.registers[this.aArgument]
        let immediate = system.memory[system.registers['pc'].toUnsignedIntValue() + 1]

        let result = Word.fromSignedIntValue(0, 3)

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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    get blockType() {
        return "cjmp"
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

    static get argumentLayout() {
        return 'N';
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

    static get argumentLayout() {
        return 'N';
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

const pseudoInstructionClasses = [
    DataDirective
]