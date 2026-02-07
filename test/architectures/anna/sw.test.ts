import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, StoreWordInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test sw constructor with valid args", () => {
    let secondArgIsHex: string[] = ['r1', 'r2', '0xab'];
    let secondArgIsDec: string[] = ['r1', 'r2', '12'];
    let secondArgIsLabel: string[] = ['r1', 'r2', '&loop'];

    new StoreWordInstruction(secondArgIsHex);
    new StoreWordInstruction(secondArgIsDec);
    new StoreWordInstruction(secondArgIsLabel);
});

test("test sw constructor with wrong number of args", () => {
    let tooLessArgs: string[] = ['r1', '-1'];
    let tooManyArgs: string[] = ['r1', 'r2', 'r3', '-1'];
    expect(() => {
        new StoreWordInstruction(tooLessArgs);
    }).toThrow(new Error('Instruction "sw" requires three arguments!'));

    expect(() => {
        new StoreWordInstruction(tooManyArgs);
    }).toThrow(new Error('Instruction "sw" requires three arguments!'));
})

test("test sw constructor with first arg invalid", () => {
    let firstArgTooShort: string[] = ['r', 'r2', '3'];
    let firstArgTooLong: string[] = ['r12', 'r2', '3'];
    let firstArgDoesNotStartWithR: string[] = ['1', 'r2', '3'];
    let firstArgNumberTooHigh: string[] = ['r9', 'r2', 'r3'];
    expect(() => {
        new StoreWordInstruction(firstArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new StoreWordInstruction(firstArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new StoreWordInstruction(firstArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new StoreWordInstruction(firstArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});


test("test sw constructor with second arg invalid", () => {
    let secondArgTooShort: string[] = ['r1', 'r', '3'];
    let secondArgTooLong: string[] = ['r1', 'r12', '3'];
    let secondArgDoesNotStartWithR: string[] = ['r1', '1', '3'];
    let secondArgNumberTooHigh: string[] = ['r1', 'r9', 'r3'];
    expect(() => {
        new StoreWordInstruction(secondArgTooShort);
    }).toThrow(new Error('Invalid argument "r"!'));

    expect(() => {
        new StoreWordInstruction(secondArgTooLong);
    }).toThrow(new Error('Invalid argument "r12"!'));

    expect(() => {
        new StoreWordInstruction(secondArgDoesNotStartWithR);
    }).toThrow(new Error('Invalid argument "1"!'));

    expect(() => {
        new StoreWordInstruction(secondArgNumberTooHigh);
    }).toThrow(new Error('Invalid argument "r9"!'));
});

test("test sw constructor with third arg invalid", () => {
    let thirdArgIsInvalid: string[] = ['r1', 'r2', 'abc'];

    expect(() => {
        new StoreWordInstruction(thirdArgIsInvalid);
    }).toThrow(new Error('Invalid argument "abc"!'));
});

test("test create store word instruction from mnemonic", () => {
    let mnemonic = "sw";
    let expectedInstruction = new StoreWordInstruction(["r1", "r2", "5"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", "5"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create store word instruction from machine code", () => {
    let machineCode = "1001001010000101";
    let expectedInstruction = new StoreWordInstruction(["r1", "r2", "5"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([{
        address: 0, value: Word.fromString(machineCode)
    }], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test store word to memory instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(51, 16);
    let reg2Word = Word.fromSignedIntValue(38, 16);

    let mockSystem = new AnnaEmulator();
    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
    }

    mockSystem.storeToMemory = vi.fn();

    let instruction = new StoreWordInstruction(["r1", "r2", "3"]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.storeToMemory).toBeCalledWith(
        41,
        Word.fromSignedIntValue(51, 16)
    );
    expect(reg1Word.toSignedIntValue()).toBe(51);
});