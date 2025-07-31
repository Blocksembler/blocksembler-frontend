import {expect, test} from "vitest";
import {AnnaInstructionFactory, OrInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/emulator.ts";

test("test or instruction to machine code", () => {
    let instruction = new OrInstruction(["r1", "r2", "r3"]);
    let expectedCode = "0011001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create or instruction from mnemonic", () => {
    let mnemonic = "or";
    let expectedInstruction = new OrInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", "r3"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create or instruction from machine code", () => {
    let machineCode = "0011001010011000";
    let expectedInstruction = new OrInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test or instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");
    let reg2Word = Word.fromString("0101010101010101");

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
    };

    let instruction = new OrInstruction(["r1", "r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(-1);
    expect(reg2Word.toSignedIntValue()).toBe(21845);
});