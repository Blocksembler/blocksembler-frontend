import {expect, test} from "vitest";
import {NopInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

test("nop instruction to string", () => {
    let instruction = new NopInstruction([]);
    expect(instruction.toString()).toBe("NOOP");
});

test("test nop instruction to machine code", () => {
    let instruction = new NopInstruction([]);
    let expectedCode = "000" + "0000" + "0" + "00000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating nop instruction from mnemonic", () => {
    let factory = new SimpleRISCInstructionFactory();

    let inst = factory.createFromMnemonic("NOOP", []);

    let expected = new NopInstruction([]);

    expect(inst).toMatchObject(expected);
});

test("create nop instruction from machine code", () => {

    let emulator = new SimpleRISCEmulator();

    let expectedInstruction = new NopInstruction([]);

    let factory = new SimpleRISCInstructionFactory()
    let instruction = factory.createFromOpCode(emulator.memory, 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute nop instruction", () => {
    let mockSystem = new SimpleRISCEmulator();

    let expectedSystemState = new SimpleRISCEmulator();

    let instruction = new NopInstruction();

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
