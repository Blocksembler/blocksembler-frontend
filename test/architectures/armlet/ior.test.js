import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    IorImmediateInstruction,
    IorInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("ior instruction to string", () => {
    let instruction = new IorInstruction(['$4', '$1', '$0']);
    expect(instruction.toString()).toBe("ior $4, $1, $0");
});

test("ior instruction with immediate to string", () => {
    let instruction = new IorImmediateInstruction(['$4', '$1', 10]);
    expect(instruction.toString()).toBe("ior $4, $1, 10");
});

test("convert ior instruction to machine code", () => {
    let instruction = new IorInstruction(['$4', '$1', '$0']);

    let expectedCode = "0" + "000" + "001" + "100" + "000011"; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert ior instruction with immediate to machine code", () => {
    let instruction = new IorImmediateInstruction(['$4', '$1', '10']);
    let expectedCode = "0" + "000" + "001" + "100" + "011100" + "0000000000001010"
    expect(instruction.toMachineCode()).toBe(expectedCode);
})

test("test creating ior instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("ior", ['$4', '$1', '$0']);

    let expected = new IorInstruction(['$4', '$1', '$0']);

    expect(inst).toMatchObject(expected);
});

test("create ior instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("ior", ['$4', '$1', '123']);

    let expected = new IorImmediateInstruction(['$4', '$1', '123']);

    expect(inst).toMatchObject(expected);
})

test("create ior instruction from machine code", () => {
    let machineCode = "0" + "110" + "010" + "111" + "000011";

    let expectedInstruction = new IorInstruction(['$7', '$2', '$6']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("create ior instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + "011100" + "0000000000001010";

    let expectedInstruction = new IorImmediateInstruction(['$7', '$2', '10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute ior instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1])
    let expectedSystemState = generateMockSystem([0, 13, 17, (213 | 67), 3, 213, 67, 7, 1])
    let instruction = new IorInstruction(['$2', '$4', '$5']);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute ior instruction with immediate", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1])
    let instruction = new IorImmediateInstruction(['$2', '$4', '10']);
    mockSystem.memory[0] = Word.fromString(instruction.toMachineCode().slice(0, 16))
    mockSystem.memory[1] = Word.fromString(instruction.toMachineCode().slice(16, 32))
});