import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    BabImmediateInstruction,
    BabInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";

let registerOpCode = "010110";
let immediateOpCode = "101011";

test("bab instruction to string", () => {
    let instruction = new BabInstruction(['$2']);
    expect(instruction.toString()).toBe("bab $2");
});

test("bab instruction with immediate to string", () => {
    let instruction = new BabImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("bab 10");
});

test("convert bab instruction to machine code", () => {
    let instruction = new BabInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert bab instruction with immediate to machine code", () => {
    let instruction = new BabImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating bab instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bab", ['$2']);

    let expected = new BabInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create bab instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bab", ['123']);

    let expected = new BabImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create bab instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BabInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create bab instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BabImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute bab instruction when condition is true", () => {
    let instruction = new BabInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000100'))

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000100'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute bab instruction when condition is false", () => {
    let instruction = new BabInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bab instruction with immediate when condition is true", () => {
    let instruction = new BabImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000100'))

    let expectedSystemState = generateMockSystem([11, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000100'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bab instruction with immediate when condition is false", () => {
    let instruction = new BabImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});