import {expect, test} from "vitest";
import {AndImmediateInstruction, AndInstruction, ArmletInstructionFactory} from "@/architectures/armlet/instructions";
import {generateMockSystem} from "./util";
import {Word} from "@/architectures/emulator";

test("and instruction to string", () => {
    let instruction = new AndInstruction(['$2', '$1', '$7']);
    expect(instruction.toString()).toBe("and $2, $1, $7");
});

test("and instruction with immediate to string", () => {
    let instruction = new AndImmediateInstruction(['$2', '$1', '10']);
    expect(instruction.toString()).toBe("and $2, $1, 10");
});

test("convert and instruction to machine code", () => {
    let instruction = new AndInstruction(['$2', '$1', '$7']);

    let expectedCode = "0" + "111" + "001" + "010" + "000010"; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert and instruction with immediate to machine code", () => {
    let instruction = new AndImmediateInstruction(['$2', '$1', '10']);

    let expectedCode = "0" + "000" + "001" + "010" + "011011" + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating and instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("and", ['$2', '$1', '$7']);

    let expected = new AndInstruction(['$2', '$1', '$7']);

    expect(inst).toStrictEqual(expected);
});

test("create and instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("and", ['$2', '$1', '123']);

    let expected = new AndImmediateInstruction(['$2', '$1', '123']);

    expect(inst).toStrictEqual(expected);
});

test("create and instruction from machine code", () => {
    let machineCode = "0" + "001" + "010" + "111" + "000010";

    let expectedInstruction = new AndInstruction(['$7', '$2', '$1']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("create and instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + "011011" + "0000000000001010";

    let expectedInstruction = new AndImmediateInstruction(['$7', '$2', '10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute and instruction", () => {
    let instruction = new AndInstruction(['$2', '$4', '$5']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, (213 & 67), 3, 213, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute and instruction with immediate", () => {
    let instruction = new AndImmediateInstruction(['$2', '$4', '10']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1], instruction);
    let expectedSystemState = generateMockSystem([0, 13, 17, (213 & 10), 3, 213, 67, 7, 1], instruction);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
