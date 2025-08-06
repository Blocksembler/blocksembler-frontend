import {expect, test} from "vitest";
import {AnnaInstructionFactory, JumpAndLinkRegisterInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/system";

test("test jump and link register instruction to machine code", () => {
    let instruction = new JumpAndLinkRegisterInstruction(["r1", "r2"]);
    let expectedCode = "1101001010000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create jump and link register instruction from mnemonic", () => {
    let mnemonic = "jalr";
    let expectedInstruction = new JumpAndLinkRegisterInstruction(["r1", "r2"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create jump and link register instruction from machine code", () => {
    let machineCode = "1101001010000000";
    let expectedInstruction = new JumpAndLinkRegisterInstruction(["r1", "r2"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {
            address: 0, value: Word.fromString(machineCode)
        }], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test jump and link register instruction", () => {
    let pcWord = Word.fromSignedIntValue(15, 16);
    let reg1Word = Word.fromSignedIntValue(23, 16);
    let reg2Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        pc: pcWord,
        1: reg1Word,
        2: reg2Word,
    }

    let instruction = new JumpAndLinkRegisterInstruction(["r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(23);
    expect(reg1Word.toSignedIntValue()).toBe(23);
    expect(reg2Word.toSignedIntValue()).toBe(16);
});