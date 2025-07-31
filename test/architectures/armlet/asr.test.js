import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    AsrImmediateInstruction,
    AsrInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("asr instruction to string", () => {
    let instruction = new AsrInstruction(['$1', '$2', '$4']);
    expect(instruction.toString()).toBe("asr $1, $2, $4");
});

test("asr instruction with immediate to string", () => {
    let instruction = new AsrInstruction(['$1', '$2', '10']);
    expect(instruction.toString()).toBe("asr $1, $2, 10");
});

test("test asr instruction to machine code", () => {
    let instruction = new AsrInstruction(['$1', '$4', '$3']);
    let expectedCode = "0" + "011" + "100" + "001" + "001011";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test asr instruction with immediate to machine code", () => {
    let instruction = new AsrImmediateInstruction(['$1', '$4', '10']);
    let expectedCode = "0" + "000" + "100" + "001" + "100010" + "0000000000001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
})

test("test creating asr instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("asr", ['$1', '$2', '$4']);
    let expected = new AsrInstruction(['$1', '$2', '$4']);
    expect(inst).toStrictEqual(expected);
});

test("test creating asr instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("asr", ['$1', '$2', '10']);
    let expected = new AsrImmediateInstruction(['$1', '$2', '10']);
    expect(inst).toStrictEqual(expected);
});

test("create asr instruction from machine code", () => {
    let machineCode = "0" + "011" + "100" + "001" + "001011";
    let expectedInstruction = new AsrInstruction(['$1', '$4', '$3']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create asr instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "100" + "001" + "100010" + "0000000000001010";
    let expectedInstruction = new AsrImmediateInstruction(['$1', '$4', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute asr instruction", () => {
    let instruction = new AsrInstruction(['$2', '$3', '$0']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, -3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, -3 >> 1, -3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute asr instruction with immediate", () => {
    let instruction = new AsrImmediateInstruction(['$2', '$3', '2']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, -3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, -3 >> 2, -3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
})

