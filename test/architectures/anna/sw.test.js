import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, StoreWordInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test create store word instruction from mnemonic", () => {
    let mnemonic = "sw";
    let expectedInstruction = new StoreWordInstruction(["r1", "r2", 5]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", "r2", 5]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create store word instruction from machine code", () => {
    let machineCode = "1001001010000101";
    let expectedInstruction = new StoreWordInstruction(["r1", "r2", 5]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test store word to memory instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromSignedIntValue(51, 16);
    let reg2Word = Word.fromSignedIntValue(38, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
            r1: reg1Word,
            r2: reg2Word,
        },
        storeToMemory: vi.fn(),
    };

    let instruction = new StoreWordInstruction(["r1", "r2", 3]);

    instruction.executeOn(mockSystem);

    expect(mockSystem.storeToMemory).toBeCalledWith(
        41,
        Word.fromSignedIntValue(51, 16)
    );
    expect(reg1Word.toSignedIntValue()).toBe(51);
});
