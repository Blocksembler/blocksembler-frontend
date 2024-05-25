import {expect, test, vi} from "vitest";
import {
    AddImmedateInstruction,
    AddInstruction,
    AndInstruction,
    AnnaInstructionFactory,
    BranchEqualZeroInstruction,
    BranchGreaterZeroInstruction,
    HaltInstruction,
    InputInstruction,
    JumpAndLinkRegisterInstruction,
    LoadLowerImmedateInstruction,
    LoadUpperImmedateInstruction,
    LoadWordInstruction,
    NotInstruction,
    OrInstruction,
    OutputInstruction,
    ShiftInstruction,
    StoreWordInstruction,
    SubtractInstruction,
} from "../../../src/architectures/anna/instructions";
import {Word} from "../../../src/architectures/system";

test("test add instruction to machien code", () => {
    let instruction = new AddInstruction({args: ["r1", "r2", "r3"]});
    let expectedCode = "0000001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating add instruction from mnemonic", () => {
    let factory = new AnnaInstructionFactory();

    let inst = factory.createFromMnemonic("add", {
        args: ["r1", "r2", "r3"],
    });
    let expected = new AddInstruction({args: ["r1", "r2", "r3"]});

    expect(inst).toMatchObject(expected);
});

test("create add instruction from machine code", () => {
    let machineCode = "0000001010011000";

    let expectedInstruction = new AddInstruction({args: ["r1", "r2", "r3"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("convert add instruction to machine code", () => {
    let instruction = new AddInstruction({args: ["r1", "r2", "r3"]});
    let expectedMachineCode = "0000001010011000";

    let machineCode = instruction.toMachineCode();

    expect(machineCode).toBe(expectedMachineCode);
});

test("add two registers and store to different register", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(17);
    let reg2Word = Word.fromSignedIntValue(5);
    let reg3Word = Word.fromSignedIntValue(3);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
            3: reg3Word,
        },
    };

    let instruction = new AddInstruction({args: ["r1", "r2", "r3"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(8);
    expect(reg2Word.toSignedIntValue()).toBe(5);
    expect(reg3Word.toSignedIntValue()).toBe(3);
});

test("add two registers and store to first operand", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(17);
    let reg2Word = Word.fromSignedIntValue(5);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new AddInstruction({args: ["r1", "r1", "r2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(22);
    expect(reg2Word.toSignedIntValue()).toBe(5);
});

test("test overflow behaviour 0xff + 0x01", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1111111111111111");
    let reg2Word = Word.fromString("0000000000000001");

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new AddInstruction({args: ["r1", "r1", "r2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(0);
    expect(reg2Word.toSignedIntValue()).toBe(1);
});

test("test subtract instruction to machien code", () => {
    let instruction = new SubtractInstruction({args: ["r1", "r2", "r3"]});
    let expectedCode = "0001001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create subtract instruction from mnemonic", () => {
    let mnemonic = "sub";
    let expectedInstruction = new SubtractInstruction({
        args: ["r1", "r2", "r3"],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", "r3"],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create subtract instruction from machine code", () => {
    let machineCode = "0001001010011000";

    let expectedInstruction = new SubtractInstruction({
        args: ["r1", "r2", "r3"],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test subtraction with positive result", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(10);
    let reg2Word = Word.fromSignedIntValue(4);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new SubtractInstruction({args: ["r1", "r1", "r2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(6);
    expect(reg2Word.toSignedIntValue()).toBe(4);
});

test("test subtraction with negative result", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(10);
    let reg2Word = Word.fromSignedIntValue(4);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new SubtractInstruction({args: ["r1", "r2", "r1"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(-6);
    expect(reg2Word.toSignedIntValue()).toBe(4);
});

test("test and instruction to machien code", () => {
    let instruction = new AndInstruction({args: ["r1", "r2", "r3"]});
    let expectedCode = "0010001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create and instruction from mnemonic", () => {
    let mnemonic = "and";
    let expectedInstruction = new AndInstruction({args: ["r1", "r2", "r3"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", "r3"],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create and instruction from machine code", () => {
    let machineCode = "0010001010011";
    let expectedInstruction = new AndInstruction({args: ["r1", "r2", "r3"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test and instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");
    let reg2Word = Word.fromString("0000000000001111");

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new AndInstruction({args: ["r1", "r1", "r2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(10);
    expect(reg2Word.toSignedIntValue()).toBe(15);
});

test("test or instruction to machien code", () => {
    let instruction = new OrInstruction({args: ["r1", "r2", "r3"]});
    let expectedCode = "0011001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create or instruction from mnemonic", () => {
    let mnemonic = "or";
    let expectedInstruction = new OrInstruction({args: ["r1", "r2", "r3"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", "r3"],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create or instruction from machine code", () => {
    let machineCode = "0011001010011";
    let expectedInstruction = new OrInstruction({args: ["r1", "r2", "r3"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test or instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");
    let reg2Word = Word.fromString("0101010101010101");

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new OrInstruction({args: ["r1", "r1", "r2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(-1);
    expect(reg2Word.toSignedIntValue()).toBe(21845);
});

test("test create not instruction from mnemonic", () => {
    let mnemonic = "not";
    let expectedInstruction = new NotInstruction({args: ["r1", "r2"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2"],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create or instruction from machine code", () => {
    let machineCode = "0100001010000000";
    let expectedInstruction = new NotInstruction({args: ["r1", "r2"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test not instruction to machien code", () => {
    let instruction = new NotInstruction({args: ["r1", "r2"]});
    let expectedCode = "0100001010000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test not instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new NotInstruction({args: ["r1", "r1"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(
        Word.fromString("0101010101010101").toSignedIntValue()
    );
});

test("test shift instruction to machien code", () => {
    let instruction = new ShiftInstruction({args: ["r1", "r2", 3]});
    let expectedCode = "0101001010000011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create shift instruction from mnemonic", () => {
    let mnemonic = "shf";
    let expectedInstruction = new ShiftInstruction({args: ["r1", "r2", 4]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", 4],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create shift instruction from machine code", () => {
    let machineCode = "010100101000100";
    let expectedInstruction = new ShiftInstruction({args: ["r1", "r2", 4]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test shift instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("0000000000000000");
    let reg2Word = Word.fromString("0000000000001111");

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new ShiftInstruction({args: ["r1", "r2", "2"]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(
        Word.fromString("0000000000111100").toSignedIntValue()
    );
});

test("test load lower immediate instruction to machine code", () => {
    let instruction = new LoadLowerImmedateInstruction({args: ["r1", 11]});
    let expectedCode = "0110001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load lower immediate instruction from mnemonic", () => {
    let mnemonic = "lli";
    let expectedInstruction = new LoadLowerImmedateInstruction({
        args: ["r1", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1", 3]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load lower immediate instruction from machine code", () => {
    let machineCode = "0110001000000011";
    let expectedInstruction = new LoadLowerImmedateInstruction({
        args: ["r1", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load lower immedate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("0000000100000000");
    let immedate = 255;

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new LoadLowerImmedateInstruction({
        args: ["r1", `${immedate}`],
    });

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(511);
});

test("test load upper immediate instruction to machine code", () => {
    let instruction = new LoadUpperImmedateInstruction({args: ["r1", 11]});
    let expectedCode = "0111001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load upper immediate instruction from mnemonic", () => {
    let mnemonic = "lui";
    let expectedInstruction = new LoadUpperImmedateInstruction({
        args: ["r1", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1", 3]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load upper immediate instruction from machine code", () => {
    let machineCode = "0111001000000011";
    let expectedInstruction = new LoadLowerImmedateInstruction({
        args: ["r1", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load upper immedate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue("1111111111111111");
    let immedate = 0;

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new LoadUpperImmedateInstruction({
        args: ["r1", `${immedate}`],
    });

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(255);
});

test("test load word instruction to machine code", () => {
    let instruction = new LoadWordInstruction({args: ["r1", "r2", 11]});
    let expectedCode = "1000001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load word instruction from mnemonic", () => {
    let mnemonic = "lw";
    let expectedInstruction = new LoadWordInstruction({
        args: ["r1", "r2", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", 3],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load lower immediate instruction from machine code", () => {
    let machineCode = "1000001010000011";
    let expectedInstruction = new LoadWordInstruction({
        args: ["r1", "r2", 3],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load word from memory instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(0, 16);
    let reg2Word = Word.fromSignedIntValue(38, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
        loadFromMemory: vi
            .fn()
            .mockImplementation(() => Word.fromSignedIntValue(123)),
    };

    let instruction = new LoadWordInstruction({args: ["r1", "r2", 3]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.loadFromMemory).toBeCalledWith(41);
    expect(reg1Word.toSignedIntValue()).toBe(123);
});

test("test store word instruction to machine code", () => {
    let instruction = new StoreWordInstruction({args: ["r1", "r2", 11]});
    let expectedCode = "1001001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create store word instruction from mnemonic", () => {
    let mnemonic = "sw";
    let expectedInstruction = new StoreWordInstruction({args: ["r1", "r2", 5]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", 5],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create store word instruction from machine code", () => {
    let machineCode = "1001001010000101";
    let expectedInstruction = new StoreWordInstruction({args: ["r1", "r2", 5]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test store word to memory instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(51, 16);
    let reg2Word = Word.fromSignedIntValue(38, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
        storeToMemory: vi.fn(),
    };

    let instruction = new StoreWordInstruction({args: ["r1", "r2", 3]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.storeToMemory).toBeCalledWith(
        41,
        Word.fromSignedIntValue(51, 16)
    );
    expect(reg1Word.toSignedIntValue()).toBe(51);
});

test("test branch if equal zero instruction to machine code", () => {
    let instruction = new BranchEqualZeroInstruction({args: ["r1", 11]});
    let expectedCode = "1010001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create branch if equal to zero instruction from mnemonic", () => {
    let mnemonic = "bez";
    let expectedInstruction = new BranchEqualZeroInstruction({
        args: ["r1", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1", 12]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create branch if equal to zero instruction from machine code", () => {
    let machineCode = "1010001000001100";
    let expectedInstruction = new BranchEqualZeroInstruction({
        args: ["r1", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test branch if equal to zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new BranchEqualZeroInstruction({args: ["r1", -10]});

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(10);
});

test("test branch if NOT equal to zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(11, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new BranchEqualZeroInstruction({args: ["r1", -10]});

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(20);
});

test("test branch if greater zero instruction to machine code", () => {
    let instruction = new BranchGreaterZeroInstruction({args: ["r1", 11]});
    let expectedCode = "1011001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create branch if greater than zero instruction from mnemonic", () => {
    let mnemonic = "bgz";
    let expectedInstruction = new BranchGreaterZeroInstruction({
        args: ["r1", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1", 12]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create branch if greater than zero instruction from machine code", () => {
    let machineCode = "1011001000001100";

    let expectedInstruction = new BranchGreaterZeroInstruction({
        args: ["r1", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test branch if greater than zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(15, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new BranchGreaterZeroInstruction({args: ["r1", -10]});

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(10);
});

test("test branch if NOT greater than zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new BranchGreaterZeroInstruction({args: ["r1", -10]});

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(20);
});

test("test add immediate instruction to machine code", () => {
    let instruction = new AddImmedateInstruction({args: ["r1", "r2", 11]});
    let expectedCode = "1100001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create add immediate instruction from mnemonic", () => {
    let mnemonic = "addi";
    let expectedInstruction = new AddImmedateInstruction({
        args: ["r1", "r2", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2", 12],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create add immediat instruction from machin code", () => {
    let machineCode = "1100001010001100";
    let expectedInstruction = new AddImmedateInstruction({
        args: ["r1", "r2", 12],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test add immediate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0, 16);
    let reg1Word = Word.fromSignedIntValue(15, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new AddImmedateInstruction({args: ["r1", "r1", -6]});

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(9);
});

test("test jump and link register instruction to machine code", () => {
    let instruction = new JumpAndLinkRegisterInstruction({
        args: ["r1", "r2"],
    });
    let expectedCode = "1101001010000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create jump and link register instruction from mnemonic", () => {
    let mnemonic = "jalr";
    let expectedInstruction = new JumpAndLinkRegisterInstruction({
        args: ["r1", "r2"],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {
        args: ["r1", "r2"],
    });

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create jump and link register instruction from machine code", () => {
    let machineCode = "1101001010000000";
    let expectedInstruction = new JumpAndLinkRegisterInstruction({
        args: ["r1", "r2"],
    });

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test jump and link register instruction", () => {
    let pcWord = Word.fromSignedIntValue(15, 16);
    let reg1Word = Word.fromSignedIntValue(23, 16);
    let reg2Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
            2: reg2Word,
        },
    };

    let instruction = new JumpAndLinkRegisterInstruction({
        args: ["r1", "r2"],
    });

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(23);
    expect(reg1Word.toSignedIntValue()).toBe(23);
    expect(reg2Word.toSignedIntValue()).toBe(16);
});

test("test input instruction to machine code", () => {
    let instruction = new InputInstruction({args: ["r1"]});
    let expectedCode = "1110001000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create input instruction from mnemonic", () => {
    let mnemonic = "in";
    let expectedInstruction = new InputInstruction({args: ["r1"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1"]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create input instruction from machine code", () => {
    let machineCode = "1110001000000000";
    let expectedInstruction = new InputInstruction({args: ["r1"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test get input instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
        callInterrupt: vi.fn().mockImplementation(() => 123),
    };

    let instruction = new InputInstruction({args: ["r1"]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith("input");
    expect(reg1Word.toSignedIntValue()).toBe(123);
});

test("test output instruction to machine code", () => {
    let instruction = new OutputInstruction({args: ["r1"]});
    let expectedCode = "1111001000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create output instruction from mnemonic", () => {
    let mnemonic = "out";
    let expectedInstruction = new OutputInstruction({args: ["r1"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {args: ["r1"]});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create output instruction from machine code", () => {
    let machineCode = "1111001000000000";
    let expectedInstruction = new OutputInstruction({args: ["r1"]});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test output instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(123, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
        callInterrupt: vi.fn(),
    };

    let instruction = new OutputInstruction({args: ["r1"]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith(
        "output",
        Word.fromSignedIntValue(123)
    );
});

test("test halt instruction to machine code", () => {
    let instruction = new HaltInstruction();
    let expectedCode = "1111000000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create halt instruction from mnemonic", () => {
    let mnemonic = ".halt";
    let expectedInstruction = new HaltInstruction({});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, {});

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create halt instruction from mnemonic", () => {
    let machineCode = "1111000000000000";
    let expectedInstruction = new HaltInstruction({});

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode(machineCode);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("teste halt instruction", () => {
    let pcWord = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
        },
        callInterrupt: vi.fn(),
    };

    let instruction = new HaltInstruction({args: ["r0"]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith("halt");
});
