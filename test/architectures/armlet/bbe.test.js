import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    BbeImmediateInstruction,
    BbeInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

let registerOpCode = "011001";
let immediateOpCode = "101110";

test("bbe instruction to string", () => {
    let instruction = new BbeInstruction(['$2']);
    expect(instruction.toString()).toBe("bbe $2");
});

test("bbe instruction with immediate to string", () => {
    let instruction = new BbeImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("bbe 10");
});

test("convert bbe instruction to machine code", () => {
    let instruction = new BbeInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert bbe instruction with immediate to machine code", () => {
    let instruction = new BbeImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating bbe instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bbe", ['$2']);

    let expected = new BbeInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create bbe instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bbe", ['123']);

    let expected = new BbeImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create bbe instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BbeInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create bbe instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BbeImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute bbe instruction when condition is true", () => {
    let instruction = new BbeInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute bbe instruction when condition is false", () => {
    let instruction = new BbeInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000100'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000100'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bbe instruction with immediate when condition is true", () => {
    let instruction = new BbeImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([10, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bbe instruction with immediate when condition is false", () => {
    let instruction = new BbeImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000100'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000100'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});