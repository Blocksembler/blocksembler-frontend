export class BaseEmulator {
    constructor(registers, addressSize, instructionFactory, interruptHandler) {
        this.instructionFactory = instructionFactory;
        this.interruptHandler = interruptHandler;
        this.addressSize = addressSize;
        this.memorySize = 2 ** addressSize;
        this.loadedProgramSize = 0;
        this.isTerminated = false;
        this.isPaused = true;
        this.executionIntervalId = -1;
        this.executionSpeed = 500;
        this.output = [];

        this.registers = {
            pc: Word.fromSignedIntValue(0, this.addressSize),
            ...registers,
        };

        this.memory = [];

        this.initMemory(this.memorySize);
    }

    print(msg) {
        this.output.push(msg.toString());
    }

    getInstructionFactory() {
        return this.instructionFactory;
    }

    initMemory() {
        this.memory = [];

        for (let address = 0; address < this.memorySize; address++) {
            this.memory[address] = Word.fromSignedIntValue(0, this.addressSize);
            this.memory[address].id = address;
        }
    }

    getMemoryFragment(start, end) {
        let fragment = [];

        for (let idx = start; idx < end; idx++) {
            fragment.push({address: idx, word: this.memory[idx]});
        }

        return fragment;
    }

    loadProgram(program) {
        this.loadedProgramSize = program.length;
        for (let address in program) {
            let code = program[address].toMachineCode();
            this.memory[address].set(Word.fromString(code));
        }
    }

    startExecution() {
        if (this.loadedProgramSize === 0) {
            alert("Please ensure your program is assembled and loaded into memory before attempting execution.")
            return
        }

        if (this.isTerminated) {
            alert("To execute the program again, please reset your hardware.")
            return
        }

        this.isPaused = false;
        this.executionIntervalId = setInterval(() => {
            this.executeSingleInstruction();
        }, this.executionSpeed)
    }

    pauseExecution() {
        this.isPaused = true;
        clearInterval(this.executionIntervalId)
    }

    executeSingleInstruction() {
        if (this.loadedProgramSize === 0) {
            alert("Please ensure your program is assembled and loaded into memory before attempting execution.")
            return
        }

        if (this.isTerminated) {
            alert("To execute the program again, please reset your hardware.")
            return
        }

        let nextInstruction = this.loadNextInstruction();
        this.registers.pc.set(this.registers.pc.addImmedate(1));
        nextInstruction.executeOn(this);
    }

    loadNextInstruction() {
        let nextInstructionAddress = this.registers.pc.toUnsignedIntValue();
        let machineCode = this.memory[nextInstructionAddress].toBitString();
        return this.instructionFactory.createFromOpCode(machineCode);
    }

    storeToMemory(address, register) {
        this.memory[address].set(register);
    }

    loadFromMemory(address) {
        return this.memory[address];
    }

    callInterrupt(intName, ...args) {
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
            this.memory[address].set(Word.fromSignedIntValue(0, this.addressSize));
        }
    }

    resetRegisters() {
        for (let regName in this.registers) {
            this.registers[regName].set(Word.fromSignedIntValue(0, this.addressSize));
        }
    }

    halt() {
        this.isTerminated = true;
    }
}

export class Word {
    bits = [];

    static fromString(bitString) {
        return Word.fromBitArray([...bitString].reverse());
    }

    static fromBitArray(bits) {
        let newWord = new Word();
        newWord.bits = bits.map((bit) => parseInt(bit));
        return newWord;
    }

    static fromSignedIntValue(instant, size = 16) {
        let newWord = new Word();
        let isNegative = instant < 0;

        if (isNegative) {
            newWord.bits = Word.integerToTwoCompliment(Math.abs(instant), size);
        } else {
            newWord.bits = Word.integerToBitArray(instant, size);
        }

        return newWord;
    }

    static integerToTwoCompliment(val, size) {
        let parsedBits = Word.integerToBitArray(val - 1, size);
        return Word.invertBits(parsedBits);
    }

    static integerToBitArray(val, size) {
        let bitArray = [...val.toString(2)]
            .map((strBit) => parseInt(strBit))
            .reverse();

        while (bitArray.length < size) {
            bitArray.push(0);
        }

        if (bitArray.length > size) {
            bitArray = bitArray.slice(0, size);
        }

        return bitArray;
    }

    static invertBits(bits) {
        return bits.map((bit) => (bit === 1 ? 0 : 1));
    }

    toSignedIntValue() {
        let isNegative = this.bits[this.bits.length - 1] === 1;

        let bits = [...this.bits].reverse();

        if (isNegative) {
            let bitString = Word.invertBits(bits).reduce(
                (prev, cur) => prev.toString() + cur.toString()
            );
            return (parseInt(bitString, 2) + 1) * -1;
        }

        return parseInt(
            bits.reduce((prev, cur) => prev.toString() + cur.toString()),
            2
        );
    }

    toUnsignedIntValue() {
        let bitString = [...this.bits].reverse().join("");
        return parseInt(bitString, 2);
    }

    set(word) {
        this.bits = [...word.bits];
    }

    add(word) {
        let result = this.toSignedIntValue() + word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.size);
    }

    addImmedate(immediate) {
        let immedateWord = Word.fromSignedIntValue(immediate);
        return this.add(immedateWord);
    }

    subtract(word) {
        let result = this.toSignedIntValue() - word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.size);
    }

    invert() {
        return Word.fromBitArray(Word.invertBits(this.bits));
    }

    or(word) {
        let result = this.toSignedIntValue() | word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    and(word) {
        let result = this.toSignedIntValue() & word.toSignedIntValue();
        return Word.fromSignedIntValue(result, this.bits.length);
    }

    shift(immediate) {
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

    toBitString() {
        return [...this.bits].reverse().join("");
    }

    toString() {
        return `${this.toSignedIntValue()}`;
    }
}

export class ImmutableWord extends Word {
    static fromString(bitString) {
        return ImmutableWord.fromBitArray([...bitString].reverse());
    }

    static fromBitArray(bits) {
        let newWord = new ImmutableWord();
        newWord.bits = bits.map((bit) => parseInt(bit));
        return newWord;
    }

    static fromSignedIntValue(instant, size = 16) {
        let newWord = new ImmutableWord();
        let isNegative = instant < 0;

        if (isNegative) {
            newWord.bits = ImmutableWord.integerToTwoCompliment(
                Math.abs(instant),
                size
            );
        } else {
            newWord.bits = ImmutableWord.integerToBitArray(instant, size);
        }

        return newWord;
    }

    static integerToTwoCompliment(val, size) {
        let parsedBits = ImmutableWord.integerToBitArray(val - 1, size);
        return ImmutableWord.invertBits(parsedBits);
    }

    static integerToBitArray(val, size) {
        let bitArray = [...val.toString(2)]
            .map((strBit) => parseInt(strBit))
            .reverse();

        while (bitArray.length < size) {
            bitArray.push(0);
        }

        if (bitArray.length > size) {
            bitArray = bitArray.slice(0, size);
        }

        return bitArray;
    }

    static invertBits(bits) {
        return bits.map((bit) => (bit === 1 ? 0 : 1));
    }

    set(word) {
        console.log("set instruction on immutable word prevented!");
    }
}
