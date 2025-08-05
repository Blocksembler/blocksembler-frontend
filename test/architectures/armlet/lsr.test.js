import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    LsrImmediateInstruction,
    LsrInstruction
} from "@/architectures/armlet/instructions.ts";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("lsr instruction to string", () => {
    let instruction = new LsrInstruction(['$1', '$2', '$4']);
    expect(instruction.toString()).toBe("lsr $1, $2, $4");
});

test("lsr instruction with immediate to string", () => {
    let instruction = new LsrInstruction(['$1', '$2', '10']);
    expect(instruction.toString()).toBe("lsr $1, $2, 10");
});

test("test lsr instruction to machine code", () => {
    let instruction = new LsrInstruction(['$1', '$4', '$3']);
    let expectedCode = "0" + "011" + "100" + "001" + "001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test lsr instruction with immediate to machine code", () => {
    let instruction = new LsrImmediateInstruction(['$1', '$4', '10']);
    let expectedCode = "0" + "000" + "100" + "001" + "100001" + "0000000000001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
})

test("test creating lsr instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("lsr", ['$1', '$2', '$4']);
    let expected = new LsrInstruction(['$1', '$2', '$4']);
    expect(inst).toStrictEqual(expected);
});

test("test creating lsr instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("lsr", ['$1', '$2', '10']);
    let expected = new LsrImmediateInstruction(['$1', '$2', '10']);
    expect(inst).toStrictEqual(expected);
});

test("create lsr instruction from machine code", () => {
    let machineCode = "0" + "011" + "100" + "001" + "001010";
    let expectedInstruction = new LsrInstruction(['$1', '$4', '$3']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create lsr instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "100" + "001" + "100001" + "0000000000001010";
    let expectedInstruction = new LsrImmediateInstruction(['$1', '$4', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute lsr instruction", () => {
    let instruction = new LsrInstruction(['$2', '$3', '$0']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, 3 >> 1, 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("test execute lsr instruction with immediate", () => {
    let instruction = new LsrImmediateInstruction(['$2', '$3', '2']);
    let mockSystem = generateMockSystem([0, 1, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 1, 17, (3 >> 2), 3, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
})

