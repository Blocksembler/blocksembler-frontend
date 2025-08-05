import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    LslImmediateInstruction,
    LslInstruction
} from "@/architectures/armlet/instructions.ts";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("lsl instruction to string", () => {
    let instruction = new LslInstruction(['$1', '$2', '$4']);
    expect(instruction.toString()).toBe("lsl $1, $2, $4");
});

test("lsl instruction with immediate to string", () => {
    let instruction = new LslInstruction(['$1', '$2', '10']);
    expect(instruction.toString()).toBe("lsl $1, $2, 10");
});

test("test lsl instruction to machine code", () => {
    let instruction = new LslInstruction(['$1', '$4', '$3']);
    let expectedCode = "0" + "011" + "100" + "001" + "001001";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test lsl instruction with immediate to machine code", () => {
    let instruction = new LslImmediateInstruction(['$1', '$4', '10']);
    let expectedCode = "0" + "000" + "100" + "001" + "100000" + "0000000000001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
})

test("test creating lsl instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("lsl", ['$1', '$2', '$4']);
    let expected = new LslInstruction(['$1', '$2', '$4']);
    expect(inst).toStrictEqual(expected);
});

test("test creating lsl instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("lsl", ['$1', '$2', '10']);
    let expected = new LslImmediateInstruction(['$1', '$2', '10']);
    expect(inst).toStrictEqual(expected);
});

test("create lsl instruction from machine code", () => {
    let machineCode = "0" + "011" + "100" + "001" + "001001";
    let expectedInstruction = new LslInstruction(['$1', '$4', '$3']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create lsl instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "100" + "001" + "100000" + "0000000000001010";
    let expectedInstruction = new LslImmediateInstruction(['$1', '$4', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute lsl instruction", () => {
    let instruction = new LslInstruction(['$2', '$3', '$0']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, 6, 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute lsl instruction with immediate", () => {
    let instruction = new LslImmediateInstruction(['$2', '$3', '2']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, (3 << 2), 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
})

