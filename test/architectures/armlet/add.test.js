import {expect, test} from "vitest";
import {
    AddImmediateInstruction,
    AddInstruction,
    ArmletInstructionFactory
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";

test("add instruction to string", () => {
    let instruction = new AddInstruction(['$1', '$2', '$3']);
    expect(instruction.toString()).toBe("add $1, $2, $3");
})

test("add instruction with immediate to string", () => {
    let instruction = new AddInstruction(['$1', '$2', '10']);
    expect(instruction.toString()).toBe("add $1, $2, 10");
})

test("test add instruction to machine code", () => {
    let instruction = new AddInstruction(['$1', '$2', '$3']);
    let expectedCode = "0" + "011" + "010" + "001" + "000110";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("add instruction with immediate to machine code", () => {
    let instruction = new AddImmediateInstruction(['$1', '$2', '10']);
    let expectedCode = "0" + "000" + "010" + "001" + "011110" + "0000000000001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating add instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("add", ['$1', '$2', '$3']);
    let expected = new AddInstruction(['$1', '$2', '$3']);
    expect(inst).toMatchObject(expected);
});

test("create add instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("add", ['$1', '$2', '10']);
    let expected = new AddImmediateInstruction(['$1', '$2', '10']);
    expect(inst).toMatchObject(expected);
})

test("create add instruction from machine code", () => {
    let machineCode = "0" + "011" + "010" + "001" + "000110";
    let expectedInstruction = new AddInstruction(['$1', '$2', '$3']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("create add instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "010" + "001" + "011110" + "0000000000001010";
    let expectedInstruction = new AddImmediateInstruction(['$1', '$2', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
})

test("test execute add instruction", () => {
    let instruction = new AddInstruction(['$2', '$4', '$5']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, 301, 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute add instruction with immediate", () => {
    let instruction = new AddImmediateInstruction(['$2', '$4', '10']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, (234 + 10), 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
})