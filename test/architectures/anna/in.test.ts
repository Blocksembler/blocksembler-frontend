import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, InputInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/system";

test("test input instruction to machine code", () => {
    let instruction = new InputInstruction(["r1"]);
    let expectedCode = "1110001000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create input instruction from mnemonic", () => {
    let mnemonic = "in";
    let expectedInstruction = new InputInstruction(["r1"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create input instruction from machine code", () => {
    let machineCode = "1110001000000000";
    let expectedInstruction = new InputInstruction(["r1"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test get input instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    }

    mockSystem.callInterrupt = vi.fn().mockImplementation(() => 123)

    let instruction = new InputInstruction(["r1"]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith("input");
    expect(reg1Word.toSignedIntValue()).toBe(123);
});