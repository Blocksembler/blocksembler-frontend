import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    BltImmediateInstruction,
    BltInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

let registerOpCode = "010011";
let immediateOpCode = "101000";

test("blt instruction to string", () => {
    let instruction = new BltInstruction(['$2']);
    expect(instruction.toString()).toBe("blt $2");
});

test("blt instruction with immediate to string", () => {
    let instruction = new BltImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("blt 10");
});

test("convert blt instruction to machine code", () => {
    let instruction = new BltInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert blt instruction with immediate to machine code", () => {
    let instruction = new BltImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating blt instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("blt", ['$2']);

    let expected = new BltInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create blt instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("blt", ['123']);

    let expected = new BltImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create blt instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BltInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)}
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create blt instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BltImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute blt instruction when condition is true", () => {
    let instruction = new BltInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute blt instruction when condition is false", () => {
    let instruction = new BltInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute blt instruction with immediate when condition is true", () => {
    let instruction = new BltImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000000'))

    let expectedSystemState = generateMockSystem([10, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000000'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute blt instruction with immediate when condition is false", () => {
    let instruction = new BltImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});