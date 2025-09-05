import {expect, test} from "vitest";
import {AnnaInstructionFactory, LoadLowerImmediateInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test load lower immediate instruction to machine code", () => {
    let instruction = new LoadLowerImmediateInstruction(["r1", "11"]);
    let expectedCode = "0110001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load lower immediate instruction from mnemonic", () => {
    let mnemonic = "lli";
    let expectedInstruction = new LoadLowerImmediateInstruction(["r1", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "3"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load lower immediate instruction from machine code", () => {
    let machineCode = "0110001000000011";
    let expectedInstruction = new LoadLowerImmediateInstruction(["r1", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load lower immediate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("0000000100000000");
    let immediate = 255;

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    }

    let instruction = new LoadLowerImmediateInstruction(["r1", `${immediate}`]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(511);
});