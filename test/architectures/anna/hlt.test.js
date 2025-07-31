import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, HaltInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";

test("test halt instruction to machine code", () => {
    let instruction = new HaltInstruction();
    let expectedCode = "1111000000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create halt instruction from mnemonic", () => {
    let mnemonic = ".halt";
    let expectedInstruction = new HaltInstruction();

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, []);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create halt instruction from opCode", () => {
    let machineCode = "1111000000000000";
    let expectedInstruction = new HaltInstruction();

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("teste halt instruction", () => {
    let pcWord = Word.fromSignedIntValue(0, 16);

    let mockSystem = {
        registers: {
            pc: pcWord,
        },
        callInterrupt: vi.fn(),
    };

    let instruction = new HaltInstruction({args: ["r0"]});

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith("halt");
});
