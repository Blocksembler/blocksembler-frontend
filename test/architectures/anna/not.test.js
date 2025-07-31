import {expect, test} from "vitest";
import {AnnaInstructionFactory, NotInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";

test("test create not instruction from mnemonic", () => {
    let mnemonic = "not";
    let expectedInstruction = new NotInstruction(["r1", "r2"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create not instruction from machine code", () => {
    let machineCode = "0100001010000000";
    let expectedInstruction = new NotInstruction(["r1", "r2"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test not instruction to machine code", () => {
    let instruction = new NotInstruction(["r1", "r2"]);
    let expectedCode = "0100001010000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test not instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
        },
    };

    let instruction = new NotInstruction(["r1", "r1"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(
        Word.fromString("0101010101010101").toSignedIntValue()
    );
});