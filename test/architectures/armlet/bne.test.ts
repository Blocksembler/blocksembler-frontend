import {expect, test} from "vitest";
import {ArmletInstructionFactory, BneImmediateInstruction, BneInstruction} from "@/architectures/armlet/instructions";
import {generateMockSystem} from "./util";
import {Word} from "@/architectures/emulator";

let registerOpCode = "010001";
let immediateOpCode = "100110";

test("bne instruction to string", () => {
    let instruction = new BneInstruction(['$2']);
    expect(instruction.toString()).toBe("bne $2");
});

test("bne instruction with immediate to string", () => {
    let instruction = new BneImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("bne 10");
});

test("convert bne instruction to machine code", () => {
    let instruction = new BneInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert bne instruction with immediate to machine code", () => {
    let instruction = new BneImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating bne instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bne", ['$2']);

    let expected = new BneInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create bne instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("bne", ['123']);

    let expected = new BneImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create bne instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new BneInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create bne instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new BneImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute bne instruction when condition is true", () => {
    let instruction = new BneInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)

    let expectedSystemState = generateMockSystem([9, 0, 0, 10, 0, 0, 0, 0, 0], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute bne instruction when condition is false", () => {
    let instruction = new BneInstruction(['$2']);

    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('000000000000001'))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bne instruction with immediate when condition is true", () => {
    let instruction = new BneImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([10, 0, 0, 0, 0, 0, 0, 0, 0], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute bne instruction with immediate when condition is false", () => {
    let instruction = new BneImmediateInstruction(['12']);

    let mockSystem = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    mockSystem.registers.status.set(Word.fromString('0000000000000001'))

    let expectedSystemState = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('0000000000000001'))
    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
