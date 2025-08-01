import {expect, test} from "vitest";
import {AnnaInstructionFactory, BranchEqualZeroInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";

test("test branch if equal zero instruction to machine code", () => {
    let instruction = new BranchEqualZeroInstruction(["r1", 11]);
    let expectedCode = "1010001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create branch if equal to zero instruction from mnemonic", () => {
    let mnemonic = "bez";
    let expectedInstruction = new BranchEqualZeroInstruction(["r1", 12]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", 12]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create branch if equal to zero instruction from machine code", () => {
    let machineCode = "1010001000001100";
    let expectedInstruction = new BranchEqualZeroInstruction(["r1", "12"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test branch if equal to zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new BranchEqualZeroInstruction(["r1", -10]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(10);
});

test("test branch if NOT equal to zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(11, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new BranchEqualZeroInstruction(["r1", -10]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(20);
});