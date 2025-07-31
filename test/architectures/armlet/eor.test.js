import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    EorImmediateInstruction,
    EorInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("eor instruction to string", () => {
    let instruction = new EorInstruction(['$4', '$1', '$5']);
    expect(instruction.toString()).toBe("eor $4, $1, $5");
});

test("eor instruction with immediate to string", () => {
    let instruction = new EorImmediateInstruction(['$4', '$1', '123']);
    expect(instruction.toString()).toBe("eor $4, $1, 123");
});

test("convert eor instruction to machine code", () => {
    let instruction = new EorInstruction(['$4', '$1', '$5']);
    let expectedCode = "0" + "101" + "001" + "100" + "000100";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert eor instruction with immediate to machine code", () => {
    let instruction = new EorImmediateInstruction(['$4', '$1', '10']);
    let expectedCode = "0" + "000" + "001" + "100" + "011101" + "0000000000001010"
    expect(instruction.toMachineCode()).toBe(expectedCode);
})

test("test creating eor instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("eor", ['$4', '$1', '$5']);
    let expected = new EorInstruction(['$4', '$1', '$5']);
    expect(inst).toStrictEqual(expected);
});

test("create eor instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("eor", ['$4', '$1', '123']);
    let expected = new EorImmediateInstruction(['$4', '$1', '123']);
    expect(inst).toStrictEqual(expected);
})

test("create eor instruction from machine code", () => {
    let machineCode = "0" + "101" + "010" + "111" + "000100";
    let expectedInstruction = new EorInstruction(['$7', '$2', '$5']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("create eor instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + "011101" + "0000000000001010";
    let expectedInstruction = new EorImmediateInstruction(['$7', '$2', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(10)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
})

test("test execute eor instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1])
    let expectedSystemState = generateMockSystem([0, 13, 17, (213 ^ 67), 3, 213, 67, 7, 1])
    let instruction = new EorInstruction(['$2', '$4', '$5']);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});


test("execute eor instruction with immediate", () => {
    let instruction = new EorImmediateInstruction(['$2', '$4', '10']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 213, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, (213 ^ 10), 3, 213, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
