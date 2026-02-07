import {expect, test} from "vitest";
import {AddInstruction, AnnaInstructionFactory} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test add constructor with valid args", () => {
    let args: string[] = ['r1', 'r2', 'r3'];
    new AddInstruction(args);
});

test("test add constructor with wrong number of args", () => {
    let tooLessArgs: string[] = ['r1', 'r2'];
    let tooManyArgs: string[] = ['r1', 'r2', 'r3', 'r4'];
    expect(() => {
        new AddInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "add" requires three arguments!'));

    expect(() => {
        new AddInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "add" requires three arguments!'));
})

test("test add constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r', 'r2', 'r3'];
    let firstArgTooLong: string[] = ['r12', 'r2', 'r3'];
    let firstArgDoesNotStartWithR: string[] = ['1', 'r2', 'r3'];
    let firstArgNumberTooHigh: string[] = ['r9', 'r2', 'r3'];
    expect(() => {
        new AddInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new AddInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new AddInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new AddInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});


test("test add constructor with second arg invalid", () => {
    let secondArgTooShort: string[] = ['r1', 'r', 'r3'];
    let secondArgTooLong: string[] = ['r1', 'r12', 'r3'];
    let secondArgDoesNotStartWithR: string[] = ['r1', '2', 'r3'];
    let secondArgNumberTooHigh: string[] = ['r1', 'r9', 'r3'];
    expect(() => {
        new AddInstruction(secondArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new AddInstruction(secondArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new AddInstruction(secondArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "2"!'));

    expect(() => {
        new AddInstruction(secondArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

test("test add constructor with third arg invalid", () => {
    let thirdArgTooShort: string[] = ['r1', 'r2', 'r'];
    let thirdArgTooLong: string[] = ['r1', 'r2', 'r12'];
    let thirdArgDoesNotStartWithR: string[] = ['r1', 'r2', '3'];
    let thirdArgNumberTooHigh: string[] = ['r1', 'r3', 'r9'];
    expect(() => {
        new AddInstruction(thirdArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new AddInstruction(thirdArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new AddInstruction(thirdArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "3"!'));

    expect(() => {
        new AddInstruction(thirdArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

test("test add instruction to machine code", () => {
    let instruction = new AddInstruction(["r1", "r2", "r3"]);
    let expectedCode = "0000001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating add instruction from mnemonic", () => {
    let factory = new AnnaInstructionFactory();

    let inst = factory.createFromMnemonic("add", ["r1", "r2", "r3"]);
    let expected = new AddInstruction(["r1", "r2", "r3"]);

    expect(inst).toStrictEqual(expected);
});

test("create add instruction from machine code", () => {
    let machineCode = "0000001010011000";

    let expectedInstruction = new AddInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("convert add instruction to machine code", () => {
    let instruction = new AddInstruction(["r1", "r2", "r3"]);
    let expectedMachineCode = "0000001010011000";

    let machineCode = instruction.toMachineCode();

    expect(machineCode).toBe(expectedMachineCode);
});

test("add two registers and store to different register", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(17);
    let reg2Word = Word.fromSignedIntValue(5);
    let reg3Word = Word.fromSignedIntValue(3);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
        r3: reg3Word,
    };

    let instruction = new AddInstruction(["r1", "r2", "r3"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(8);
    expect(reg2Word.toSignedIntValue()).toBe(5);
    expect(reg3Word.toSignedIntValue()).toBe(3);
});

test("add two registers and store to first operand", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(17);
    let reg2Word = Word.fromSignedIntValue(5);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
    };

    let instruction = new AddInstruction(["r1", "r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(22);
    expect(reg2Word.toSignedIntValue()).toBe(5);
});

test("test overflow behaviour 0xff + 0x01", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1111111111111111");
    let reg2Word = Word.fromString("0000000000000001");

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        "pc": pcWord,
        "r1": reg1Word,
        "r2": reg2Word,
    };

    let instruction = new AddInstruction(["r1", "r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(0);
    expect(reg2Word.toSignedIntValue()).toBe(1);
});

