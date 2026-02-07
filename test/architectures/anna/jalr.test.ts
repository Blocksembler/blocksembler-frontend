import {expect, test} from "vitest";
import {AnnaInstructionFactory, JumpAndLinkRegisterInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test jalr constructor with valid args", () => {
    let args: string[] = ['r1', 'r2'];
    new JumpAndLinkRegisterInstruction(args);
});

test("test jalr constructor with wrong number of args", () => {
    let tooLessArgs: string[] = ['r1'];
    let tooManyArgs: string[] = ['r1', 'r2', 'r3'];

    expect(() => {
        new JumpAndLinkRegisterInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "jalr" requires three arguments!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "jalr" requires three arguments!'));
})

test("test jalr constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r', 'r2'];
    let firstArgTooLong: string[] = ['r12', 'r2'];
    let firstArgDoesNotStartWithR: string[] = ['1', 'r2'];
    let firstArgNumberTooHigh: string[] = ['r9', 'r2'];

    expect(() => {
        new JumpAndLinkRegisterInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

test("test jalr constructor with second arg invalid", () => {
    let secondArgTooShort: string[] = ['r1', 'r'];
    let secondArgTooLong: string[] = ['r1', 'r12'];
    let secondArgDoesNotStartWithR: string[] = ['r1', '1'];
    let secondArgNumberTooHigh: string[] = ['r1', 'r9'];

    expect(() => {
        new JumpAndLinkRegisterInstruction(secondArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(secondArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(secondArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new JumpAndLinkRegisterInstruction(secondArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});


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
    let pcWord = Word.fromSignedIntValue(16, 16);
    let reg1Word = Word.fromSignedIntValue(23, 16);
    let reg2Word = Word.fromSignedIntValue(0, 16);

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
    }

    let instruction = new JumpAndLinkRegisterInstruction(["r1", "r2"]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(23);
    expect(reg1Word.toSignedIntValue()).toBe(23);
    expect(reg2Word.toSignedIntValue()).toBe(16);
});