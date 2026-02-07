import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, OutputInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test out constructor with valid args", () => {
    let args: string[] = ['r1'];
    new OutputInstruction(args);
});

test("test out constructor with wrong number of args", () => {
    let tooLessArgs: string[] = [];
    let tooManyArgs: string[] = ['r1', 'r2'];

    expect(() => {
        new OutputInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "out" requires three arguments!'));

    expect(() => {
        new OutputInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "out" requires three arguments!'));
})

test("test out constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r'];
    let firstArgTooLong: string[] = ['r12'];
    let firstArgDoesNotStartWithR: string[] = ['1'];
    let firstArgNumberTooHigh: string[] = ['r9'];

    expect(() => {
        new OutputInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new OutputInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new OutputInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new OutputInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

test("test output instruction to machine code", () => {
    let instruction = new OutputInstruction(["r1"]);
    let expectedCode = "1111001000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create output instruction from mnemonic", () => {
    let mnemonic = "out";
    let expectedInstruction = new OutputInstruction(["r1"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create output instruction from machine code", () => {
    let machineCode = "1111001000000000";
    let expectedInstruction = new OutputInstruction(["r1"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {
            address: 0, value: Word.fromString(machineCode)
        }], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test output instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(123, 16);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
    }

    mockSystem.callInterrupt = vi.fn();

    let instruction = new OutputInstruction(["r1"]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith(
        "output",
        "123"
    );
});