import {expect, test} from "vitest";
import {AddInstruction, AnnaInstructionFactory} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";

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

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
            r3: reg3Word,
        },
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

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
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

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
    };

    let instruction = new AddInstruction(["r1", "r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(0);
    expect(reg2Word.toSignedIntValue()).toBe(1);
});

