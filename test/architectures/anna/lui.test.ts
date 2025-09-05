import {expect, test} from "vitest";
import {
    AnnaInstructionFactory,
    LoadLowerImmediateInstruction,
    LoadUpperImmediateInstruction
} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test load upper immediate instruction to machine code", () => {
    let instruction = new LoadUpperImmediateInstruction(["r1", "11"]);
    let expectedCode = "0111001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load upper immediate instruction from mnemonic", () => {
    let mnemonic = "lui";
    let expectedInstruction = new LoadUpperImmediateInstruction(["r1", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "3"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load upper immediate instruction from machine code", () => {
    let machineCode = "0111001000000011";
    let expectedInstruction = new LoadLowerImmediateInstruction(["r1", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load upper immediate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0, 16);
    let reg1Word = Word.fromString("1111111111111111", 16);
    let immediate = 0;

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    };

    let instruction = new LoadUpperImmediateInstruction(["r1", `${immediate}`]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(255);
});