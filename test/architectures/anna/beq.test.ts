import {expect, test} from "vitest";
import {AnnaInstructionFactory, BranchEqualZeroInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test bez constructor with valid args", () => {
    let secondArgIsHex: string[] = ['r1', '0xab'];
    let secondArgIsDec: string[] = ['r1', '12'];
    let secondArgIsLabel: string[] = ['r1', '&loop'];
    new BranchEqualZeroInstruction(secondArgIsHex);
    new BranchEqualZeroInstruction(secondArgIsDec);
    new BranchEqualZeroInstruction(secondArgIsLabel);
});

test("test bez constructor with wrong number of args", () => {
    let tooLessArgs: string[] = ['r1'];
    let tooManyArgs: string[] = ['r1', 'r2', '-1'];
    expect(() => {
        new BranchEqualZeroInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "bez" requires two arguments!'));

    expect(() => {
        new BranchEqualZeroInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "bez" requires two arguments!'));
})

test("test bez constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r', '3'];
    let firstArgTooLong: string[] = ['r12', '3'];
    let firstArgDoesNotStartWithR: string[] = ['1', '3'];
    let firstArgNumberTooHigh: string[] = ['r9', 'r3'];
    expect(() => {
        new BranchEqualZeroInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new BranchEqualZeroInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new BranchEqualZeroInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new BranchEqualZeroInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});


test("test bez constructor with second arg invalid", () => {
    let secondArgIsInvalid: string[] = ['r1', 'abc'];

    expect(() => {
        new BranchEqualZeroInstruction(secondArgIsInvalid);
    }).toThrow(new Error('Invalid argument "abc"!'));
});

test("test branch if equal zero instruction to machine code", () => {
    let instruction = new BranchEqualZeroInstruction(["r1", "11"]);
    let expectedCode = "1010001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create branch if equal to zero instruction from mnemonic", () => {
    let mnemonic = "bez";
    let expectedInstruction = new BranchEqualZeroInstruction(["r1", "12"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "12"]);

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

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    };

    let instruction = new BranchEqualZeroInstruction(["r1", "-10"]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(10);
});

test("test branch if NOT equal to zero instruction", () => {
    let pcWord = Word.fromSignedIntValue(20, 16);
    let reg1Word = Word.fromSignedIntValue(11, 16);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    };

    let instruction = new BranchEqualZeroInstruction(["r1", "-10"]);

    instruction.executeOn(mockSystem);

    expect(pcWord.toSignedIntValue()).toBe(20);
});