import {BaseInstruction} from "@/architectures/instructions";
import {BaseEmulator, Word} from "@/architectures/emulator";
import {addressSize, ArmletEmulator} from "@/architectures/armlet/system";
import Random from "java-random";
import {Block, BlockSvg, WorkspaceSvg} from "blockly";
import {Instruction, MemoryLocation} from "@/types/emulator";


const createLabelBlocks = (ws: WorkspaceSvg, labels: Array<string>) => {
    const blocks = [];
    let prevBlock = null;

    for (let label of labels) {
        let labelDefBlock = ws.newBlock('labelDef')
        labelDefBlock.initSvg();

        labelDefBlock.getField('label')?.setValue(label.slice(1));

        if (prevBlock && prevBlock.nextConnection && labelDefBlock.previousConnection) {
            prevBlock.nextConnection.connect(labelDefBlock.previousConnection);
        }

        blocks.push(labelDefBlock);
        prevBlock = labelDefBlock;
    }

    return blocks
}


const intToOpCode = (n: number): string => {
    return Number(n).toString(2).padStart(6, '0')
}

const regToBinary = (reg: string): string => {
    if (!reg) {
        return "000";
    }
    return Number(reg[1]).toString(2).padStart(3, '0');
}

const containsImmediate = (args: Array<string>): boolean => {
    if (args.length === 0) {
        return false;
    }

    return !(args[args.length - 1].startsWith('$'));
}

export class ArmletInstructionFactory {
    createFromMnemonic(mnemonic: string, args: Array<string>): Instruction {
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

    getRegisterInstructionClassByMnemonic(mnemonic: string): typeof AbstractArmletInstruction {
        for (let clazz of instructionClasses) {
            if (clazz.getMnemonic() === mnemonic) {
                return clazz;
            }
        }

        throw new Error(`Unknown instruction: ${mnemonic}`);
    }

    getImmediateInstructionClassByMnemonic(mnemonic: string): typeof AbstractArmletInstruction {
        for (let clazz of immediateInstructionClasses) {
            if (clazz.getMnemonic() === mnemonic) {
                return clazz;
            }
        }

        throw new Error(`Unknown instruction: ${mnemonic}`);
    }

    getPseudoInstructionClassByMnemonic(mnemonic: string): typeof AbstractArmletInstruction | null {
        for (let clazz of pseudoInstructionClasses) {
            if (clazz.getMnemonic() === mnemonic) {
                return clazz;
            }
        }

        return null;
    }

    createFromOpCode(memory: Array<MemoryLocation>, address: number): AbstractArmletInstruction {
        let instWord = memory[address].value.toBitString()

        let instructionClass = this.getInstructionClassByOpCode(instWord.slice(10, 16));

        if (address + 1 >= memory.length) {
            return instructionClass.fromMachineCode(instWord + "0".repeat(addressSize));
        }

        let immediateWord = memory[address + 1].value.toBitString()
        return instructionClass.fromMachineCode(instWord + immediateWord);
    }

    getInstructionClassByOpCode(opCode: string): typeof AbstractArmletInstruction {
        for (let clazz of instructionClasses) {
            if (clazz.getOpCode() === opCode) {
                return clazz;
            }
        }

        for (let clazz of immediateInstructionClasses) {
            if (clazz.getOpCode() === opCode) {
                return clazz;
            }
        }

        throw new Error(`Unknown opcode: ${opCode}`);
    }
}

export class AbstractArmletInstruction extends BaseInstruction {

    static get argumentLayout(): string {
        return "A";
    }

    get lArgument(): string {

        let constructor = this.constructor as typeof AbstractArmletInstruction;

        const lPos = constructor.argumentLayout.indexOf('L')

        if (lPos < 0) {
            return "";
        }

        return this.args[lPos]
    }

    get aArgument(): string {

        let constructor = this.constructor as typeof AbstractArmletInstruction;

        const aPos = constructor.argumentLayout.indexOf('A')

        if (aPos < 0) {
            return "";
        }

        return this.args[aPos]
    }

    get bArgument(): string {

        let constructor = this.constructor as typeof AbstractArmletInstruction;

        const bPos = constructor.argumentLayout.indexOf('B')

        if (bPos < 0) {
            return "";
        }

        return this.args[bPos]
    }

    get immediate(): string {
        let constructor = this.constructor as typeof AbstractArmletInstruction;

        const iPos = constructor.argumentLayout.indexOf('I')

        if (iPos < 0) {
            return "";
        }

        return this.args[iPos]
    }

    get blockType() {
        let constructor = this.constructor as typeof AbstractArmletInstruction;

        return constructor.getMnemonic();
    }

    static getOpCode(): string {
        throw Error("Not implemented");
    }

    static getMnemonic(): string {
        throw Error("Not implemented");
    }

    static extractL(code: string) {
        return `$${parseInt(code.slice(7, 10), 2)}`;
    }

    static extractA(code: string) {
        return `$${parseInt(code.slice(4, 7), 2)}`;
    }

    static extractB(code: string) {
        return `$${parseInt(code.slice(1, 4), 2)}`;
    }

    static fromMachineCode(code: string) {
        let l = this.extractL(code)
        let a = this.extractA(code)
        let b = this.extractB(code)

        return new this([l, a, b])
    }

    toMachineCode() {
        let constructor = this.constructor as typeof AbstractArmletInstruction;

        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)
        let b = regToBinary(this.bArgument)

        return "0" + b + a + l + constructor.getOpCode();
    }

    toString(): string {
        let constructor = this.constructor as typeof AbstractArmletInstruction;

        let cmd = constructor.getMnemonic()
        if (this.args.length > 0) {
            cmd = cmd + " " + this.args.join(", ")
        }

        if (this.comment) {
            cmd += " # " + this.comment
        }

        return cmd
    }

    toBlocks(ws: WorkspaceSvg): Array<Block> {
        const blocks = createLabelBlocks(ws, this.labels);

        let block = ws.newBlock(this.blockType);
        block.initSvg();

        this.setBlockFields(ws, block);


        if (blocks.length > 0) {
            const prevBlock = blocks[blocks.length - 1];

            if (prevBlock.nextConnection && block.previousConnection) {
                prevBlock.nextConnection.connect(block.previousConnection);
            }
        }

        blocks.push(block);
        return blocks;
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        if (this.lArgument) {
            let destinationBlock = ws.newBlock('register');
            destinationBlock.initSvg();
            destinationBlock.getField('value')?.setValue(Number(this.lArgument[1]))

            let movDestConnection = block.getInput('L')?.connection;

            if (movDestConnection && destinationBlock.outputConnection) {
                movDestConnection.connect(destinationBlock.outputConnection);
            }
        }

        if (this.aArgument) {
            let aBlock = ws.newBlock('register');
            aBlock.initSvg();
            aBlock.getField('value')?.setValue(Number(this.aArgument[1]));

            let aConnection = block.getInput('A')?.connection;

            if (aConnection && aBlock.outputConnection) {
                aConnection.connect(aBlock.outputConnection);
            }
        }

        if (this.bArgument) {
            let bBlock = ws.newBlock('register');
            bBlock.initSvg();
            bBlock.getField('value')?.setValue(Number(this.bArgument[1]));

            let bConnection = block.getInput('B')?.connection;

            if (bConnection && bBlock.outputConnection) {
                bConnection.connect(bBlock.outputConnection);
            }
        }

        if (this.immediate) {
            let iBlock;
            let constructor = this.constructor as typeof AbstractArmletInstruction;

            if (this.immediate.startsWith('>')) {
                iBlock = ws.newBlock('label');
                iBlock.initSvg();
                iBlock.getField('value')?.setValue(this.immediate.slice(1));
            } else if (this.immediate.startsWith('0x')) {
                iBlock = ws.newBlock('hexImmediate');
                iBlock.initSvg();
                iBlock.getField('value')?.setValue(this.immediate);
            } else if (this.immediate.startsWith('-')) {
                iBlock = ws.newBlock('signedDecImmediate');
                iBlock.initSvg();
                iBlock.getField('value')?.setValue(this.immediate);
            } else {
                iBlock = ws.newBlock('decImmediate');
                iBlock.initSvg();
                iBlock.getField('value')?.setValue(Number(this.immediate));
            }

            if (!constructor.argumentLayout.includes('A')) {
                let iConnection = block.getInput('A')?.connection;

                if (iConnection && iBlock.outputConnection) {
                    iConnection.connect(iBlock.outputConnection);
                }
            } else {
                let iConnection = block.getInput('B')?.connection;

                if (iConnection && iBlock.outputConnection) {
                    iConnection.connect(iBlock.outputConnection);
                }
            }
        }

        if (this.comment) {
            block.setCommentText(this.comment);
        }
    }
}

export class AbstractImmediateArmletInstruction extends AbstractArmletInstruction {
    get immediateBitString(): string {
        let immediateValue = Number(this.immediate);
        return Word.fromSignedIntValue(immediateValue, 16).toBitString()
    }

    static fromMachineCode(code: string): AbstractImmediateArmletInstruction {
        let instWord = code.slice(0, 16);
        let immediateWord = code.slice(16, 32);

        let l = this.extractL(instWord)
        let a = this.extractA(instWord)

        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([l, a, immediate])
    }

    toMachineCode(): string {
        let constructor = this.constructor as typeof AbstractArmletInstruction;

        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)
        let b = "000"


        return "0" + b + a + l + constructor.getOpCode() + this.immediateBitString
    }

    executeOn(e: BaseEmulator) {
        e.registers.pc = e.registers.pc.addImmediate(1)
    }
}

export class AbstractArmletControlInstruction extends AbstractArmletInstruction {

    static get argumentLayout(): string {
        return "A";
    }

    static fromMachineCode(code: string) {
        let a = this.extractA(code)

        return new this([a])
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        let constructor = this.constructor as typeof AbstractArmletControlInstruction;

        if (block.getField('condition')) {
            block.getField('condition')?.setValue(constructor.getMnemonic());
        }
    }

    toMachineCode(): string {
        let l = "000"
        let a = regToBinary(this.aArgument)
        let b = "000"

        let constructor = this.constructor as typeof AbstractArmletControlInstruction;

        return "0" + b + a + l + constructor.getOpCode()
    }

    getJmpTarget(e: BaseEmulator): Word {
        return e.registers[this.aArgument].addImmediate(-1);
    }
}

export class AbstractArmletImmediateControlInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "I";
    }

    static fromMachineCode(code: string): AbstractArmletImmediateControlInstruction {
        let immediate = `${parseInt(code.slice(16, 32), 2)}`
        return new this([immediate])
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        let constructor = this.constructor as typeof AbstractArmletImmediateControlInstruction;

        if (block.getField('condition')) {
            block.getField('condition')?.setValue(constructor.getMnemonic());
        }
    }

    toMachineCode(): string {
        let l = "000"
        let a = "000"
        let b = "000"

        let constructor = this.constructor as typeof AbstractArmletImmediateControlInstruction;

        return "0" + b + a + l + constructor.getOpCode() + this.immediateBitString
    }

    getJmpTarget(e: BaseEmulator): Word {
        let immediateAddress = e.registers.pc.toUnsignedIntValue() + 1
        let immediate = e.memory[immediateAddress]
        return immediate.value.addImmediate(-2)
    }
}

export class DataDirective extends AbstractArmletInstruction {
    static getMnemonic() {
        return "%data"
    }

    toString(): string {
        let constructor = this.constructor as typeof DataDirective;
        return `${constructor.getMnemonic()} ${this.args.join(", ")}`
    }

    toMachineCode(): string {
        return this.args.map(arg => Number(arg))
            .map(arg => Word.fromSignedIntValue(arg, addressSize).toBitString())
            .join('')
    }

    toBlocks(ws: WorkspaceSvg): Array<Block> {
        const blocks = createLabelBlocks(ws, this.labels);

        if (this.args.length === 0) {
            return [];
        }

        if (this.args.length === 1) {
            let dataWord = ws.newBlock('decimalWord');
            dataWord.initSvg();
            dataWord.setFieldValue(this.args[0], 'data');

            if (this.comment) {
                dataWord.setCommentText(this.comment)
            }

            if (blocks.length > 0) {
                const prevBlock = blocks[blocks.length - 1];

                if (prevBlock.nextConnection && dataWord.previousConnection) {
                    prevBlock.nextConnection.connect(dataWord.previousConnection);
                }
            }

            blocks.push(dataWord);
            return blocks
        }

        let dataWordsBlock = ws.newBlock('data')
        dataWordsBlock.initSvg();

        let wordData = ws.newBlock('decimalWord')
        wordData.initSvg();

        wordData.getField('data')?.setValue(this.args[0]);

        if (this.comment) {
            dataWordsBlock.setCommentText(this.comment)
        }

        if (dataWordsBlock.getInput('dataWords')?.connection && wordData.previousConnection) {
            dataWordsBlock.getInput('dataWords')?.connection?.connect(wordData.previousConnection);
        }

        for (let arg of this.args.slice(1)) {
            let nextWord = ws.newBlock('decimalWord');
            nextWord.initSvg();
            nextWord.getField('data')?.setValue(arg);

            if (nextWord.previousConnection && wordData.nextConnection) {
                nextWord.previousConnection.connect(wordData.nextConnection);
            }

            wordData = nextWord;
        }

        dataWordsBlock.setCollapsed(true);

        if (blocks.length > 0) {
            const prevBlock = blocks[blocks.length - 1];

            if (prevBlock.nextConnection && dataWordsBlock.previousConnection) {
                prevBlock.nextConnection.connect(dataWordsBlock.previousConnection);
            }
        }

        blocks.push(dataWordsBlock)
        return blocks;
    }
}

export class RandPermDirective extends AbstractArmletInstruction {
    static getMnemonic() {
        return "%randperm"
    }

    toString() {
        let constructor = this.constructor as typeof RandPermDirective;
        return `${constructor.getMnemonic()} ${this.args.join(", ")}`;
    }

    shuffle(lst: Array<number>, seed: number) {
        const rnd = new Random(seed);

        for (let i = lst.length - 1; i > 0; i--) {
            let j = rnd.nextInt(i + 1);

            let tmp = lst[i];
            lst[i] = lst[j];
            lst[j] = tmp;
        }
    }

    toMachineCode() {
        let seed = parseInt(this.args[0])
        let n = parseInt(this.args[1])
        let lst = Array.from(Array(n).keys());
        lst = lst.map(val => val + 1);

        this.shuffle(lst, seed)

        let machineCode = ""

        for (let val of lst) {
            machineCode += Word.fromSignedIntValue(val).toBitString();
        }

        return machineCode;
    }

    toBlocks(ws: WorkspaceSvg): Array<Block> {

        const blocks = createLabelBlocks(ws, this.labels);

        let randPermBlock = ws.newBlock('randPerm')
        randPermBlock.initSvg()

        randPermBlock.setFieldValue(parseInt(this.args[0]), 'seed')
        randPermBlock.setFieldValue(parseInt(this.args[1]), 'n')

        if (this.comment) {
            randPermBlock.setCommentText(this.comment)
        }

        if (blocks.length > 0) {
            const prevBlock = blocks[blocks.length - 1];

            if (prevBlock.nextConnection && randPermBlock.previousConnection) {
                prevBlock.nextConnection.connect(randPermBlock.previousConnection);
            }
        }

        blocks.push(randPermBlock)

        return blocks;
    }
}

export class RandDirective extends AbstractArmletInstruction {
    static getMnemonic() {
        return "%rand"
    }

    toString() {
        let constructor = this.constructor as typeof RandDirective;
        return `${constructor.getMnemonic()} ${this.args.join(", ")}`;
    }

    toMachineCode() {
        let n = parseInt(this.args[0])
        let seed;

        if (this.args.length === 1) {
            seed = 2 ** 16 - 1
        } else {
            seed = parseInt(this.args[1])
        }

        const random = new Random(seed);
        const randomValues = [];

        for (let i = 0; i < n; i++) {
            randomValues.push(random.nextInt(2 ** 16))
        }

        let machineCode = ""

        for (let val of randomValues) {
            machineCode += Word.fromSignedIntValue(val).toBitString();
        }

        return machineCode;
    }

    toBlocks(ws: WorkspaceSvg): Array<Block> {
        const blocks = createLabelBlocks(ws, this.labels);

        let randPermBlock = ws.newBlock('rand')
        randPermBlock.initSvg()

        randPermBlock.setFieldValue(parseInt(this.args[0]), 'n')

        if (this.comment) {
            randPermBlock.setCommentText(this.comment)
        }

        if (this.args.length === 1) {
            randPermBlock.setFieldValue(2 ** 16 - 1, 'seed')
        } else {
            randPermBlock.setFieldValue(parseInt(this.args[1]), 'seed')
        }

        if (blocks.length > 0) {
            const prevBlock = blocks[blocks.length - 1];

            if (prevBlock.nextConnection && randPermBlock.previousConnection) {
                prevBlock.nextConnection.connect(randPermBlock.previousConnection);
            }
        }

        blocks.push(randPermBlock)

        return blocks;
    }
}

export class NopInstruction extends AbstractArmletInstruction {

    constructor() {
        super([]);
    }

    static get argumentLayout() {
        return "N";
    }

    static getMnemonic() {
        return "nop"
    }

    static getOpCode() {
        return intToOpCode(0)
    }

    static fromMachineCode(_code: string) {
        return new NopInstruction();
    }

    executeOn(_e: BaseEmulator) {
        // Do nothing
    }

    toString(): string {
        return NopInstruction.getMnemonic();
    }

    toBlock(ws: WorkspaceSvg) {
        let block = ws.newBlock(NopInstruction.getMnemonic());
        (block as unknown as BlockSvg).initSvg();

        return block;
    }
}

export class MovInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LA";
    }

    static getMnemonic(): string {
        return "mov"
    }

    static getOpCode(): string {
        return intToOpCode(1)
    }

    static fromMachineCode(code: string): MovInstruction {
        let instWord = code.slice(0, 32)

        return new MovInstruction([this.extractL(instWord), this.extractA(instWord)]);
    }

    executeOn(e: BaseEmulator) {
        let targetReg = e.registers[this.lArgument];
        let sourceReg = e.registers[this.aArgument];
        targetReg.set(sourceReg);
    }
}

export class MovImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LI";
    }

    static getMnemonic(): string {
        return "mov"
    }

    static getOpCode(): string {
        return intToOpCode(26)
    }

    static fromMachineCode(code: string): MovImmediateInstruction {
        let instWord = code.slice(0, 16);
        let immediateWord = code.slice(16, 32);

        let l = this.extractL(instWord)
        let immediate = `${parseInt(immediateWord, 2)}`

        return new this([l, immediate])
    }

    executeOn(e: BaseEmulator): void {
        let targetReg = e.registers[this.lArgument];
        let immediate = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value
        e.registers['pc'].addImmediate(1)

        targetReg.set(immediate);
    }
}

export class AndInstruction extends AbstractArmletInstruction {

    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "linst"
    }

    static getMnemonic() {
        return "and"
    }

    static getOpCode() {
        return intToOpCode(2)
    }

    static fromMachineCode(code: string) {
        return new AndInstruction([this.extractL(code), this.extractA(code), this.extractB(code)]);
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('and');
    }

    executeOn(e: ArmletEmulator) {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.registers[this.bArgument]

        let result = firstOp.and(secondOp)
        dest.set(result)
    }
}

export class AndImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout() {
        return "LAI";
    }

    get blockType() {
        return "linst"
    }

    static getMnemonic() {
        return "and"
    }

    static getOpCode() {
        return intToOpCode(27)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('and');
    }

    executeOn(e: BaseEmulator) {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value

        let result = firstOp.and(secondOp)
        dest.set(result)
    }
}

export class IorInstruction extends AbstractArmletInstruction {
    static get argumentLayout() {
        return "LAB";
    }

    get blockType() {
        return "linst"
    }

    static getMnemonic() {
        return "ior"
    }

    static getOpCode() {
        return intToOpCode(3)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('ior');
    }

    executeOn(e: BaseEmulator): void {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.registers[this.bArgument]

        let result = firstOp.or(secondOp)
        dest.set(result)
    }
}

export class IorImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    get blockType(): string {
        return "linst"
    }

    static getMnemonic(): string {
        return "ior"
    }

    static getOpCode(): string {
        return intToOpCode(28)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('ior');
    }

    executeOn(e: BaseEmulator): void {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.memory[e.registers['pc'].toUnsignedIntValue() + 1]

        let result = firstOp.or(secondOp.value)
        dest.set(result)
    }
}

export class EorInstruction extends AbstractArmletInstruction {

    static get argumentLayout(): string {
        return "LAB";
    }

    get blockType(): string {
        return "linst"
    }

    static getMnemonic(): string {
        return "eor"
    }

    static getOpCode(): string {
        return intToOpCode(4)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block) {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('eor');
    }

    executeOn(e: BaseEmulator): void {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.registers[this.bArgument]

        let result = firstOp.xor(secondOp)
        dest.set(result)
    }
}

export class EorImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    get blockType(): string {
        return "linst"
    }

    static getMnemonic(): string {
        return "eor"
    }

    static getOpCode(): string {
        return intToOpCode(29)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('eor');
    }

    executeOn(e: BaseEmulator): void {
        let dest = e.registers[this.lArgument]
        let firstOp = e.registers[this.aArgument]
        let secondOp = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value
        let result = firstOp.xor(secondOp)
        dest.set(result)
    }
}

export class NotInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LA";
    }

    static getMnemonic(): string {
        return "not"
    }

    static getOpCode(): string {
        return intToOpCode(5)
    }

    static fromMachineCode(code: string): NotInstruction {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument]
        let firstOpReg = e.registers[this.aArgument]

        destReg.set(firstOpReg.invert())
    }
}

export class AddInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LAB";
    }

    get blockType(): string {
        return "ainst"
    }

    static getMnemonic(): string {
        return "add"
    }

    static getOpCode(): string {
        return intToOpCode(6)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('add');
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpReg = e.registers[this.bArgument];

        let result = firstOpReg.add(secondOpReg);
        destReg.set(result);
    }
}

export class AddImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    get blockType(): string {
        return "ainst"
    }

    static getMnemonic(): string {
        return "add"
    }

    static getOpCode(): string {
        return intToOpCode(30)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('add');
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpReg = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value;

        let result = firstOpReg.add(secondOpReg);
        destReg.set(result);
    }
}

export class SubInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LAB";
    }

    get blockType(): string {
        return "ainst"
    }

    static getMnemonic(): string {
        return "sub"
    }

    static getOpCode(): string {
        return intToOpCode(7)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('sub');
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpReg = e.registers[this.bArgument];

        let twoCompliment = secondOpReg.invert().addImmediate(1)

        let result = firstOpReg.add(twoCompliment);
        destReg.set(result);
    }
}

export class SubImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    get blockType(): string {
        return "ainst"
    }

    static getMnemonic(): string {
        return "sub"
    }

    static getOpCode(): string {
        return intToOpCode(31)
    }

    setBlockFields(ws: WorkspaceSvg, block: Block): void {
        super.setBlockFields(ws, block);

        block.getField('operation')?.setValue('sub');
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpReg = e.memory[e.registers['pc'].toUnsignedIntValue() + 1];

        let twoCompliment = secondOpReg.value.invert().addImmediate(1)

        let result = firstOpReg.add(twoCompliment);
        destReg.set(result);
    }
}

export class NegInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LA";
    }

    static getMnemonic(): string {
        return "neg"
    }

    static getOpCode(): string {
        return intToOpCode(8)
    }

    static fromMachineCode(code: string) {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }


    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];

        let negVal = firstOpReg.invert().addImmediate(1);
        destReg.set(negVal);
    }
}

export class LslInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LAB";
    }

    static getMnemonic(): string {
        return "lsl"
    }

    static getOpCode(): string {
        return intToOpCode(9)
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument]
        let firstOpReg = e.registers[this.aArgument]
        let secondOpVal = e.registers[this.bArgument].toUnsignedIntValue()

        let result = firstOpReg.shift(secondOpVal)
        destReg.set(result)
    }
}

export class LslImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    static getMnemonic(): string {
        return "lsl"
    }

    static getOpCode(): string {
        return intToOpCode(32)
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument]
        let firstOpReg = e.registers[this.aArgument]
        let secondOpVal = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value.toUnsignedIntValue()

        let result = firstOpReg.shift(secondOpVal)
        destReg.set(result)
    }
}

export class LsrInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LAB";
    }

    static getMnemonic(): string {
        return "lsr"
    }

    static getOpCode(): string {
        return intToOpCode(10)
    }

    executeOn(e: BaseEmulator): void {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpVal = e.registers[this.bArgument].toUnsignedIntValue();

        let result = firstOpReg.shift(-secondOpVal);
        destReg.set(result);
    }
}

export class LsrImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    static getMnemonic(): string {
        return "lsr";
    }

    static getOpCode(): string {
        return intToOpCode(33)
    }

    executeOn(e: BaseEmulator) {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpVal = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value.toUnsignedIntValue();

        let result = firstOpReg.shift(-secondOpVal);
        destReg.set(result);
    }
}

export class AsrInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LAB";
    }

    static getMnemonic(): string {
        return "asr"
    }

    static getOpCode(): string {
        return intToOpCode(11)
    }

    executeOn(e: BaseEmulator) {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpVal = e.registers[this.bArgument].toSignedIntValue();

        let result = firstOpReg.arithmeticShift(-secondOpVal);

        destReg.set(result);
    }
}

export class AsrImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "LAI";
    }

    static getMnemonic(): string {
        return "asr";
    }

    static getOpCode(): string {
        return intToOpCode(34);
    }

    executeOn(e: BaseEmulator) {
        let destReg = e.registers[this.lArgument];
        let firstOpReg = e.registers[this.aArgument];
        let secondOpVal = e.memory[e.registers['pc'].toUnsignedIntValue() + 1].value.toUnsignedIntValue();

        let result = firstOpReg.arithmeticShift(-secondOpVal);

        destReg.set(result);
    }
}

export class LoaInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LA";
    }

    static getMnemonic(): string {
        return "loa";
    }

    static getOpCode(): string {
        return intToOpCode(12);
    }

    static fromMachineCode(code: string): LoaInstruction {
        let l = this.extractL(code)
        let a = this.extractA(code)

        return new this([l, a])
    }

    toMachineCode(): string {
        let constructor = this.constructor as typeof LoaInstruction;

        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)

        return "0" + "000" + a + l + constructor.getOpCode()
    }

    executeOn(e: BaseEmulator) {
        let idx = e.registers[this.aArgument].toUnsignedIntValue();
        e.registers[this.lArgument].set(e.memory[idx].value);
    }
}

export class StoInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "LA";
    }

    static getMnemonic(): string {
        return "sto";
    }

    static getOpCode(): string {
        return intToOpCode(13);
    }

    static fromMachineCode(code: string): StoInstruction {
        let l = this.extractL(code);
        let a = this.extractA(code);

        return new this([l, a]);
    }

    toMachineCode(): string {
        let constructor = this.constructor as typeof StoInstruction;

        let l = regToBinary(this.lArgument)
        let a = regToBinary(this.aArgument)

        return "0" + "000" + a + l + constructor.getOpCode();
    }

    executeOn(e: BaseEmulator) {
        let idx = e.registers[this.lArgument].toUnsignedIntValue()
        e.memory[idx].value.set(e.registers[this.aArgument])
    }
}

export class CmpInstruction extends AbstractArmletInstruction {
    static get argumentLayout(): string {
        return "AB";
    }

    static getMnemonic(): string {
        return "cmp";
    }

    static getOpCode(): string {
        return intToOpCode(14);
    }

    static fromMachineCode(code: string): CmpInstruction {
        let a = this.extractA(code);
        let b = this.extractB(code);

        return new this([a, b]);
    }

    toMachineCode(): string {
        let constructor = this.constructor as typeof CmpInstruction;

        let l = "000";
        let a = regToBinary(this.aArgument);
        let b = regToBinary(this.bArgument);

        return "0" + b + a + l + constructor.getOpCode();
    }

    executeOn(e: BaseEmulator): void {
        let firstOp = e.registers[this.aArgument];
        let secondOp = e.registers[this.bArgument];

        let result = Word.fromSignedIntValue(0, 3);

        if (firstOp.toBitString() === secondOp.toBitString()) {
            result.bits[0] = 1;
        }

        if (firstOp.toSignedIntValue() > secondOp.toSignedIntValue()) {
            result.bits[1] = 1;
        }

        if (firstOp.toUnsignedIntValue() > secondOp.toUnsignedIntValue()) {
            result.bits[2] = 1;
        }

        e.registers['status'].set(result);
    }
}

export class CmpImmediateInstruction extends AbstractImmediateArmletInstruction {
    static get argumentLayout(): string {
        return "AI";
    }

    static getMnemonic(): string {
        return "cmp";
    }

    static getOpCode(): string {
        return intToOpCode(35);
    }

    static fromMachineCode(code: string): CmpImmediateInstruction {
        let instWord = code.slice(0, 16);
        let immediateWord = code.slice(16, 32);

        let a = this.extractA(instWord);
        let immediate = `${parseInt(immediateWord, 2)}`;

        return new this([a, immediate]);
    }

    toMachineCode(): string {
        let constructor = this.constructor as typeof CmpImmediateInstruction;

        let l = "000";
        let a = regToBinary(this.aArgument);
        let b = "000";

        return "0" + b + a + l + constructor.getOpCode() + this.immediateBitString;
    }

    executeOn(e: BaseEmulator): void {
        let firstOp = e.registers[this.aArgument]
        let immediate = e.memory[e.registers['pc'].toUnsignedIntValue() + 1]

        let result = Word.fromSignedIntValue(0, 3)

        if (firstOp.toBitString() === immediate.value.toBitString()) {
            result.bits[0] = 1;
        }

        if (firstOp.toSignedIntValue() > immediate.value.toSignedIntValue()) {
            result.bits[1] = 1;
        }

        if (firstOp.toUnsignedIntValue() > immediate.value.toUnsignedIntValue()) {
            result.bits[2] = 1;
        }

        e.registers['status'].set(result)
    }
}

export class JmpInstruction extends AbstractArmletControlInstruction {
    get blockType(): string {
        return "jmp";
    }

    static getMnemonic(): string {
        return "jmp";
    }

    static getOpCode(): string {
        return intToOpCode(15);
    }

    executeOn(e: BaseEmulator): void {
        e.registers['pc'].set(this.getJmpTarget(e))
    }
}

export class JmpImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType(): string {
        return "jmp";
    }

    static getMnemonic(): string {
        return "jmp";
    }

    static getOpCode(): string {
        return intToOpCode(36);
    }

    executeOn(e: BaseEmulator): void {
        e.registers['pc'].set(this.getJmpTarget(e))
    }
}

export class BeqInstruction extends AbstractArmletControlInstruction {
    get blockType(): string {
        return "cjmp";
    }

    static getMnemonic(): string {
        return "beq";
    }

    static getOpCode(): string {
        return intToOpCode(16);
    }

    executeOn(e: ArmletEmulator): void {

        if (e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }

}

export class BeqImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "beq";
    }

    static getOpCode() {
        return intToOpCode(37);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BneInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bne";
    }

    static getOpCode() {
        return intToOpCode(17);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BneImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bne";
    }

    static getOpCode() {
        return intToOpCode(38);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BgtInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bgt";
    }

    static getOpCode() {
        return intToOpCode(18);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isGtFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BgtImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bgt";
    }

    static getOpCode() {
        return intToOpCode(39);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isGtFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BltInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "blt";
    }

    static getOpCode() {
        return intToOpCode(19);
    }

    executeOn(e: ArmletEmulator) {
        if (!(e.isGtFlagSet || e.isEqFlagSet)) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BltImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "blt";
    }

    static getOpCode() {
        return intToOpCode(40);
    }

    executeOn(e: ArmletEmulator) {
        if (!(e.isGtFlagSet || e.isEqFlagSet)) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }

}

export class BgeInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bge";
    }

    static getOpCode() {
        return intToOpCode(20);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isGtFlagSet || e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BgeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bge";
    }

    static getOpCode() {
        return intToOpCode(41);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isGtFlagSet || e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BleInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "ble";
    }

    static getOpCode() {
        return intToOpCode(21);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isGtFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BleImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "ble";
    }

    static getOpCode() {
        return intToOpCode(42);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isGtFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BabInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bab";
    }

    static getOpCode() {
        return intToOpCode(22);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isAbFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BabImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bab";
    }

    static getOpCode() {
        return intToOpCode(43);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isAbFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BbwInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bbw";
    }

    static getOpCode() {
        return intToOpCode(23);
    }

    executeOn(e: ArmletEmulator) {
        if (!(e.isAbFlagSet || e.isEqFlagSet)) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BbwImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bbw";
    }

    static getOpCode() {
        return intToOpCode(44);
    }

    executeOn(e: ArmletEmulator) {
        if (!(e.isAbFlagSet || e.isEqFlagSet)) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BaeInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bae";
    }

    static getOpCode() {
        return intToOpCode(24);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isAbFlagSet || e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BaeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bae";
    }

    static getOpCode() {
        return intToOpCode(45);
    }

    executeOn(e: ArmletEmulator) {
        if (e.isAbFlagSet || e.isEqFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BbeInstruction extends AbstractArmletControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bbe";
    }

    static getOpCode() {
        return intToOpCode(25);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isAbFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class BbeImmediateInstruction extends AbstractArmletImmediateControlInstruction {
    get blockType() {
        return "cjmp"
    }

    static getMnemonic() {
        return "bbe";
    }

    static getOpCode() {
        return intToOpCode(46);
    }

    executeOn(e: ArmletEmulator) {
        if (!e.isAbFlagSet) {
            e.registers['pc'].set(this.getJmpTarget(e))
        }
    }
}

export class TrpInstruction extends AbstractArmletInstruction {
    constructor() {
        super([]);
    }

    static get argumentLayout() {
        return 'N';
    }

    static getMnemonic() {
        return "trp"
    }

    static getOpCode() {
        return intToOpCode(62)
    }

    static fromMachineCode(_code: string) {
        return new TrpInstruction();
    }

    executeOn(e: ArmletEmulator) {
        e.callInterrupt('alert', 'Execution paused!');
        e.pauseExecution()
    }
}

export class HltInstruction extends AbstractArmletInstruction {
    constructor() {
        super([]);
    }

    static get argumentLayout() {
        return 'N';
    }

    static getMnemonic() {
        return "hlt";
    }

    static getOpCode() {
        return intToOpCode(63);
    }

    executeOn(e: ArmletEmulator) {
        e.callInterrupt("hlt");
    }
}

const instructionClasses: Array<typeof AbstractArmletInstruction> = [
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

const immediateInstructionClasses: Array<typeof AbstractArmletInstruction> = [
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

const pseudoInstructionClasses: Array<typeof AbstractArmletInstruction> = [
    DataDirective,
    RandPermDirective,
    RandDirective,
]