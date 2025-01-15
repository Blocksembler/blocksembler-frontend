import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, OutputInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

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
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test output instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(123, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
        callInterrupt: vi.fn(),
    };

    let instruction = new OutputInstruction(["r1"]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith(
        "output",
        Word.fromSignedIntValue(123)
    );
});