import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    MovImmediateInstruction,
    MovInstruction
} from "@/architectures/armlet/instructions.ts";
import {Word} from "@/architectures/emulator.ts";
import {generateMockSystem} from "./util.js";

test("mov instruction to string", () => {
    let instruction = new MovInstruction(['$4', '$1']);
    expect(instruction.toString()).toBe("mov $4, $1");
});

test("mov instruction with immediate to string", () => {
    let instruction = new MovImmediateInstruction(['$4', '15']);
    expect(instruction.toString()).toBe("mov $4, 15");
});

test("test mov instruction to machine code", () => {
    let instruction = new MovInstruction(['$4', '$1']);        // mov $4, $1

    let expectedCode = "0" + "000" + "001" + "100" + "000001";                      // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test mov instruction with immediate to machine code", () => {
    let instruction = new MovImmediateInstruction(['$4', '15']);        // mov $4, $1

    let expectedCode = "0" + "000" + "000" + "100" + "011010" + "0000000000001111";                      // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("create mov instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + "000001";

    let expectedInstruction = new MovInstruction(['$7', '$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test creating mov instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("mov", ['$1', '123']);

    let expected = new MovImmediateInstruction(['$1', "123"]);

    expect(inst).toStrictEqual(expected);
});

test("test execute mov instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1])
    let expectedSystemState = generateMockSystem([0, 13, 17, 2, 3, 2, 67, 7, 1])
    let instruction = new MovInstruction(['$2', '$4']);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute mov instruction with immediate", () => {
    let instruction = new MovImmediateInstruction(['$2', '12345']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, 12345, 3, 2, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

