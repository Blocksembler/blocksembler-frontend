import {expect, test} from "vitest";
import {AddImmediateInstruction, AnnaInstructionFactory} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";

test("test add immediate instruction to machine code", () => {
    let instruction = new AddImmediateInstruction(["r1", "r2", 11]);
    let expectedCode = "1100001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create add immediate instruction from mnemonic", () => {
    let mnemonic = "addi";
    let expectedInstruction = new AddImmediateInstruction(["r1", "r2", 12]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", 12]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create add immediate instruction from machine code", () => {
    let machineCode = "1100001010001100";
    let expectedInstruction = new AddImmediateInstruction(["r1", "r2", "12"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test add immediate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0, 16);
    let reg1Word = Word.fromSignedIntValue(15, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new AddImmediateInstruction(["r1", "r1", -6]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(9);
});