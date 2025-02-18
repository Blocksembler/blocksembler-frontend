import {expect, test} from "vitest";
import {AnnaInstructionFactory, BranchGreaterZeroInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test branch if greater zero instruction to machine code", () => {
    let instruction = new BranchGreaterZeroInstruction(["r1", 11]);
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

    let expectedInstruction = new BranchGreaterZeroInstruction(["r1", 12]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test branch if greater than zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(15, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new BranchGreaterZeroInstruction(["r1", -10]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(10);
});

test("test branch if NOT greater than zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new BranchGreaterZeroInstruction(["r1", -10]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(20);
});