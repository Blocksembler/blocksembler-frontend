import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, InputInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test in constructor with valid args", () => {
    let args: string[] = ['r1'];
    new InputInstruction(args);
});

test("test in constructor with wrong number of args", () => {
    let tooLessArgs: string[] = [];
    let tooManyArgs: string[] = ['r1', 'r2'];

    expect(() => {
        new InputInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "in" requires three arguments!'));

    expect(() => {
        new InputInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "in" requires three arguments!'));
})

test("test in constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r'];
    let firstArgTooLong: string[] = ['r12'];
    let firstArgDoesNotStartWithR: string[] = ['1'];
    let firstArgNumberTooHigh: string[] = ['r9'];

    expect(() => {
        new InputInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new InputInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new InputInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new InputInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

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