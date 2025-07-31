import type {Instruction, InstructionFactory, InterruptFunction, MemoryLocation} from '@/types/emulator';


export class BaseEmulator {
    instructionFactory: InstructionFactory;
    interruptHandler: Record<string, InterruptFunction>;
    addressSize: number;
    memorySize: number;
    loadedProgramSize: number;
    isTerminated: boolean;
    isPaused: boolean;
    executionIntervalId: ReturnType<typeof setInterval> | null;
    executionSpeed: number;
    hasConsole: boolean;
    output: Array<string>;
    registers: Record<string, Word>;
    memory: Array<MemoryLocation>;

    constructor(registers: Record<string, Word>,
                addressSize: number,
                instructionFactory: InstructionFactory,
                interruptHandler: Record<string, InterruptFunction>,
                hasConsole: boolean = true) {

        this.instructionFactory = instructionFactory;
        this.interruptHandler = interruptHandler;
        this.addressSize = addressSize;
        this.memorySize = 2 ** addressSize;
        this.loadedProgramSize = 0;
        this.isTerminated = false;
        this.isPaused = true;
        this.executionIntervalId = null;
        this.executionSpeed = 500;
        this.hasConsole = hasConsole;
        this.output = [];

        this.registers = {
            'pc': Word.fromSignedIntValue(0, this.addressSize),
            ...registers,
        };

        this.memory = [];

        this.initMemory();
    }

    print(msg: string) {
        this.output.push(msg.toString());
    }

    initMemory() {
        this.memory = [];

        for (let address = 0; address < this.memorySize; address++) {
            this.memory.push({
                address: address,
                value: Word.fromSignedIntValue(0),
            })
        }
    }

    getMemoryFragment(start: number, end: number): Array<MemoryLocation> {
        return this.memory.slice(start, end);
    }

    loadProgram(program: Array<Instruction>) {
        let code = ""
        for (let inst of program) {
            code += inst.toMachineCode();
        }

        this.loadedProgramSize = Number(code.length / this.addressSize);

        let addr = 0;

        while (addr < this.loadedProgramSize) {
            const codeSlice = code.slice(addr * this.addressSize, (addr + 1) * this.addressSize);
            this.memory[addr] = {
                address: addr,
                value: Word.fromString(codeSlice, this.addressSize),
            };

            addr += 1
        }
    }

    startExecution() {
        if (this.loadedProgramSize === 0) {
            this.callInterrupt("alert", "Please ensure your program is assembled and loaded into memory before attempting execution.");
            return
        }

        if (this.isTerminated) {
            this.callInterrupt("alert", "To execute the program again, please reset your hardware.")
            return
        }

        this.isPaused = false;

        this.executionIntervalId = setInterval(() => {
            this.executeSingleInstruction();
        }, this.executionSpeed);
    }

    pauseExecution() {
        this.isPaused = true;
        if (this.executionIntervalId !== null)
            clearInterval(this.executionIntervalId);
    }

    executeSingleInstruction() {
        if (this.loadedProgramSize === 0) {
            this.callInterrupt("alert", "Please ensure your program is assembled and loaded into memory before attempting execution.");
            return
        }

        if (this.isTerminated) {
            this.callInterrupt('alert', "To execute the program again, please reset your hardware.")
            return
        }

        let nextInstruction = this.loadInstructionAt(this.registers.pc.toUnsignedIntValue());
        let instructionLength = Math.floor(nextInstruction.toMachineCode().length / this.addressSize);
        nextInstruction.executeOn(this);
        this.registers.pc.set(this.registers.pc.addImmediate(instructionLength));
    }

    loadInstructionAt(address: number): Instruction {
        return this.instructionFactory.createFromOpCode(this.memory, address);
    }

    storeToMemory(address: number, register: Word) {
        this.memory[address].value.set(register);
    }

    loadFromMemory(address: number): Word {
        return this.memory[address].value;
    }

    callInterrupt(intName: string, ...args: Array<string>): string | void {
        const continueAfterInterrupt = !this.isPaused;
        this.pauseExecution()

        const returnVal = this.interruptHandler[intName](this, ...args);

        if (!this.isTerminated && continueAfterInterrupt) {
            this.startExecution()
        }

        return returnVal
    }

    resetMemory() {
        this.loadedProgramSize = 0;
        for (let address in this.memory) {
            this.memory[address].value.set(Word.fromSignedIntValue(0, this.addressSize));
        }
    }

    resetRegisters() {
        for (let regName in this.registers) {
            this.registers[regName].set(Word.fromSignedIntValue(0, this.registers[regName].len));
        }
    }

    halt() {
        if (this.executionIntervalId !== null) {
            clearInterval(this.executionIntervalId);
        }

        this.isTerminated = true;
    }
}

type Bit = 0 | 1;

export class Word {
    bits: Array<Bit> = [];

    get len() {
        return this.bits.length;
    }

    static fromString(bitString: string, size: number = 16) {
        if (size) {
            bitString = bitString.padStart(size, "0").slice(0, size);
        }

        const bits: Array<Bit> = [];
        for (let c of bitString) {
            if (c == "0")
                bits.push(0);
            else if (c == "1")
                bits.push(1);
            else
                throw new Error("Unknown bit: " + c);
        }

        return Word.fromBitArray(bits.reverse());
    }

    static fromBitArray(bits: Array<Bit>) {
        let newWord = new Word();
        newWord.bits = [...bits];
        return newWord;
    }

    static fromSignedIntValue(instant: number, size = 16): Word {
        let newWord: Word = new Word();
        let isNegative: boolean = instant < 0;

        if (isNegative) {
            return Word.integerToTwoCompliment(Math.abs(instant), size);
        } else {
            newWord.bits = Word.integerToBitArray(instant, size);
        }

        return newWord;
    }

    static integerToTwoCompliment(val: number, size: number): Word {
        let parsedBits = Word.integerToBitArray(val - 1, size);
        let newWord: Word = new Word();
        newWord.bits = Word.invertBits(parsedBits);
        return newWord;
    }

    static integerToBitArray(val: number, size: number): Array<Bit> {
        let bitArray: Array<Bit> = [...val.toString(2)]
            .map((strBit: string): Bit => strBit === "0" ? 0 : 1)
            .reverse();

        while (bitArray.length < size) {
            bitArray.push(0);
        }

        if (bitArray.length > size) {
            bitArray = bitArray.slice(0, size);
        }

        return bitArray;
    }

    static invertBits(bits: Array<Bit>): Array<Bit> {
        return bits.map((bit) => (bit === 1 ? 0 : 1));
    }

    toSignedIntValue(): number {
        let isNegative = this.bits[this.bits.length - 1] === 1;

        let bits = [...this.bits].reverse();

        if (isNegative) {
            let bitString = ""

            for (let b of bits) {
                bitString += b.toString() == "0" ? "1" : "0";
            }

            return (parseInt(bitString, 2) + 1) * -1;
        }

        let bitStr = "";

        for (let b of bits) {
            bitStr += b.toString();
        }
        return parseInt(bitStr, 2);
    }

    toHexValue(): string {
        let hexStr = String(parseInt(this.toBitString(), 2).toString(16));
        let len = Number(this.bits.length / 4);
        return `0x${hexStr.padStart(len, '0')}`;
    }

    toUnsignedIntValue(): number {
        let bitString = [...this.bits].reverse().join("");
        return parseInt(bitString, 2);
    }

    set(word: Word) {
        this.bits = [...word.bits];
    }

    add(word: Word) {
        let result = this.toSignedIntValue() + word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    inc(): Word {
        let result = this.toSignedIntValue() + 1;
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    dec(): Word {
        let result = this.toSignedIntValue() - 1;
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    addImmediate(immediate: number): Word {
        let immediateWord = Word.fromSignedIntValue(immediate, this.bits.length);
        return this.add(immediateWord);
    }

    subtract(word: Word): Word {
        let result = this.toSignedIntValue() - word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    invert(): Word {
        return Word.fromBitArray(Word.invertBits(this.bits));
    }

    or(word: Word): Word {
        let result = this.toSignedIntValue() | word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    xor(word: Word): Word {
        let result = this.toSignedIntValue() ^ word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    and(word: Word): Word {
        let result = this.toUnsignedIntValue() & word.toUnsignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    shift(immediate: number): Word {
        let size = this.bits.length;

        let newWord = Word.fromBitArray(this.bits);

        if (immediate > 0) {
            newWord.bits.reverse();
        }
        for (let idx = 0; idx < Math.abs(immediate); idx++) {
            newWord.bits.shift();
        }
        while (newWord.bits.length < size) {
            newWord.bits.push(0);
        }
        if (immediate > 0) {
            newWord.bits.reverse();
        }

        return newWord;
    }

    arithmeticShift(immediate: number): Word {
        let size = this.bits.length;

        let val = this.toSignedIntValue();

        if (immediate > 0) {
            val = val << immediate;
        } else {
            val = val >> Math.abs(immediate);
        }

        return Word.fromSignedIntValue(val, size)
    }

    toBitString(): string {
        return [...this.bits].reverse().join("");
    }

    toString(): string {
        return `${this.toSignedIntValue()}`;
    }
}

export class ImmutableWord extends Word {
    static fromString(bitString: string, size: number): Word {
        const newWord = new ImmutableWord();
        newWord.bits = Word.fromString(bitString, size).bits;
        return newWord;
    }

    static fromBitArray(bits: Array<Bit>): Word {
        const newWord = new ImmutableWord();
        newWord.bits = Word.fromBitArray(bits).bits;
        return newWord;
    }

    static fromSignedIntValue(instant: number, size: number = 16): Word {
        const newWord = new ImmutableWord();
        newWord.bits = Word.fromSignedIntValue(instant, size).bits;
        return newWord;
    }

    set(_word: Word): void {
        // Do Nothing
    }
}
