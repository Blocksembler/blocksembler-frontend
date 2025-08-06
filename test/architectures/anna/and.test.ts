import {expect, test} from "vitest";
import {AndInstruction, AnnaInstructionFactory} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/system";

test("test and instruction to machine code", () => {
    let instruction = new AndInstruction(["r1", "r2", "r3"]);
    let expectedCode = "0010001010011000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create and instruction from mnemonic", () => {
    let mnemonic = "and";
    let expectedInstruction = new AndInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", "r3"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create and instruction from machine code", () => {
    let machineCode = "0010001010011000";
    let expectedInstruction = new AndInstruction(["r1", "r2", "r3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test and instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("1010101010101010");
    let reg2Word = Word.fromString("0000000000001111");

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
    };

    let instruction = new AndInstruction(["r1", "r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(10);
    expect(reg2Word.toSignedIntValue()).toBe(15);
});