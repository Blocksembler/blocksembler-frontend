import {expect, test} from "vitest";
import {ArmletInstructionFactory, BeqImmediateInstruction, BeqInstruction} from "@/architectures/armlet/instructions";
import {generateMockSystem} from "./util";
import {Word} from "@/architectures/emulator";

let registerOpCode = "010000";
let immediateOpCode = "100101";

test("beq instruction to string", () => {
    let instruction = new BeqInstruction(['$2']);
    expect(instruction.toString()).toBe("beq $2");
});

test("beq instruction with immediate to string", () => {
    let instruction = new BeqImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("beq 10");
});

test("convert beq instruction to machine code", () => {
    let instruction = new BeqInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert beq instruction with immediate to machine code", () => {
    let instruction = new BeqImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating beq instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("beq", ['$2']);

    let expected = new BeqInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create beq instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("beq", ['123']);

    let expected = new BeqImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create beq instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BeqInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create beq instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BeqImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute beq instruction when condition is true", () => {
    let instruction = new BeqInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('0000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute beq instruction when condition is false", () => {
    let instruction = new BeqInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute beq instruction with immediate when condition is true", () => {
    let instruction = new BeqImmediateInstruction(['12']);
    let mockSystem = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([10, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('0000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute beq instruction with immediate when condition is false", () => {
    let instruction = new BeqImmediateInstruction(['12']);
    let mockSystem = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)

    let expectedSystemState = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
