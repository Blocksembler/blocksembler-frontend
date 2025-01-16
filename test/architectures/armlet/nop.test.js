import {expect, test} from "vitest";
import {ArmletInstructionFactory, NopInstruction} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";

test("nop instruction to string", () => {
    let instruction = new NopInstruction([]);
    expect(instruction.toString()).toBe("nop");
});

test("test nop instruction to machien code", () => {
    let instruction = new NopInstruction([]);
    let expectedCode = "0000000000000000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating nop instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("nop", []);

    let expected = new NopInstruction([]);

    expect(inst).toMatchObject(expected);
});

test("create nop instruction from machine code", () => {

    let emulator = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0])

    let expectedInstruction = new NopInstruction([]);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode(emulator.memory, 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute nop instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1])
    let expectedSystemState = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1])
    let instruction = new NopInstruction();

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
