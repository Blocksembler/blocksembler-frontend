import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, LoadWordInstruction, StoreWordInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/system";

test("test load word instruction to machine code", () => {
    let instruction = new LoadWordInstruction(["r1", "r2", "11"]);
    let expectedCode = "1000001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load word instruction from mnemonic", () => {
    let mnemonic = "lw";
    let expectedInstruction = new LoadWordInstruction(["r1", "r2", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", "3"]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load word instruction from machine code", () => {
    let machineCode = "1000001010000011";
    let expectedInstruction = new LoadWordInstruction(["r1", "r2", "3"]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load word from memory instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(0, 16);
    let reg2Word = Word.fromSignedIntValue(38, 16);

    let mockSystem = new AnnaEmulator();

    mockSystem.registers = {
        pc: pcWord,
        r1: reg1Word,
        r2: reg2Word,
    }

    mockSystem.loadFromMemory = vi.fn().mockImplementation(() => Word.fromSignedIntValue(123));

    let instruction = new LoadWordInstruction(["r1", "r2", "3"]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.loadFromMemory).toBeCalledWith(41);
    expect(reg1Word.toSignedIntValue()).toBe(123);
});

test("test store word instruction to machine code", () => {
    let instruction = new StoreWordInstruction(["r1", "r2", "11"]);
    let expectedCode = "1001001010001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});