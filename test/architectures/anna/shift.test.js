import {expect, test} from "vitest";
import {AnnaInstructionFactory, ShiftInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test shift instruction to machien code", () => {
    let instruction = new ShiftInstruction(["r1", "r2", 3]);
    let expectedCode = "0101001010000011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create shift instruction from mnemonic", () => {
    let mnemonic = "shf";
    let expectedInstruction = new ShiftInstruction(["r1", "r2", 4]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", 4]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create shift instruction from machine code", () => {
    let machineCode = "0101001010000011";
    let expectedInstruction = new ShiftInstruction(["r1", "r2", 3]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test shift instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("0000000000000000");
    let reg2Word = Word.fromString("0000000000001111");

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
    };

    let instruction = new ShiftInstruction(["r1", "r2", "2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(
        Word.fromString("0000000000111100").toSignedIntValue()
    );
});