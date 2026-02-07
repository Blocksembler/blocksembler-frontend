import {expect, test, vi} from "vitest";
import {AnnaInstructionFactory, HaltInstruction} from "@/architectures/anna/instructions";
import {Word} from "@/architectures/emulator";
import {AnnaEmulator} from "@/architectures/anna/emulator";

test("test .halt constructor with valid args", () => {
    let args: string[] = [];
    new HaltInstruction(args);
});

test("test .halt constructor with wrong number of args", () => {
    let tooManyArgs: string[] = ['r1'];

    expect(() => {
        new HaltInstruction(tooManyArgs);
    }).toThrow(new Error('.halt does not expect any arguments!'));
})


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

    let mockSystem = new AnnaEmulator();
    mockSystem.registers.pc = pcWord;
    mockSystem.callInterrupt = vi.fn();

    let instruction = new HaltInstruction();

    instruction.executeOn(mockSystem);

    expect(mockSystem.callInterrupt).toBeCalledWith("halt");
});
