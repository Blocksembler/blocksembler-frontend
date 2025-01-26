import {expect, test} from "vitest";
import {
    AnnaInstructionFactory,
    LoadLowerImmedateInstruction,
    LoadUpperImmedateInstruction
} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test load upper immediate instruction to machine code", () => {
    let instruction = new LoadUpperImmedateInstruction(["r1", 11]);
    let expectedCode = "0111001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load upper immediate instruction from mnemonic", () => {
    let mnemonic = "lui";
    let expectedInstruction = new LoadUpperImmedateInstruction(["r1", 3]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", 3]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load upper immediate instruction from machine code", () => {
    let machineCode = "0111001000000011";
    let expectedInstruction = new LoadLowerImmedateInstruction(["r1", 3]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

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

    let instruction = new LoadUpperImmedateInstruction(["r1", `${immedate}`]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(255);
});