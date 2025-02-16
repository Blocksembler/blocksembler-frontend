import {expect, test} from "vitest";
import {AnnaInstructionFactory, SubtractInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test subtract instruction to machine code", () => {
    let instruction = new SubtractInstruction(["r1", "r2", "r3"]);
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

    let expectedInstruction = new SubtractInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test subtraction with positive result", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(10);
    let reg2Word = Word.fromSignedIntValue(4);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
    };

    let instruction = new SubtractInstruction(["r1", "r1", "r2"]);

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
            r1: reg1Word,
            r2: reg2Word,
        },
    };

    let instruction = new SubtractInstruction(["r1", "r2", "r1"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(-6);
    expect(reg2Word.toSignedIntValue()).toBe(4);
});