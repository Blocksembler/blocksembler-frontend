import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    BbwImmediateInstruction,
    BbwInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";

let registerOpCode = "010111";
let immediateOpCode = "101100";

test("bbw instruction to string", () => {
    let instruction = new BbwInstruction(['$2']);
    expect(instruction.toString()).toBe("bbw $2");
});

test("bbw instruction with immediate to string", () => {
    let instruction = new BbwImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("bbw 10");
});

test("convert bbw instruction to machine code", () => {
    let instruction = new BbwInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert bbw instruction with immediate to machine code", () => {
    let instruction = new BbwImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating bbw instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bbw", ['$2']);

    let expected = new BbwInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create bbw instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bbw", ['123']);

    let expected = new BbwImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create bbw instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BbwInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create bbw instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BbwImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute bbw instruction when condition is true", () => {
    let instruction = new BbwInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute bbw instruction when condition is false", () => {
    let instruction = new BbwInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bbw instruction with immediate when condition is true", () => {
    let instruction = new BbwImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([10, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bbw instruction with immediate when condition is false", () => {
    let instruction = new BbwImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});