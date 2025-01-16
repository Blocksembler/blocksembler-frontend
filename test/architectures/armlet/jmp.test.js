import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    JmpImmediateInstruction,
    JmpInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";

let registerOpCode = "001111";
let immediateOpCode = "100100";

test("jmp instruction to string", () => {
    let instruction = new JmpInstruction(['$2']);
    expect(instruction.toString()).toBe("jmp $2");
});

test("jmp instruction with immediate to string", () => {
    let instruction = new JmpImmediateInstruction(['10']);
    expect(instruction.toString()).toBe("jmp 10");
});

test("convert jmp instruction to machine code", () => {
    let instruction = new JmpInstruction(['$2']);

    let expectedCode = "0" + "000" + "010" + "000" + registerOpCode; // "0" + B + A + L + OpCode

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert jmp instruction with immediate to machine code", () => {
    let instruction = new JmpImmediateInstruction(['10']);

    let expectedCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating jmp instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("jmp", ['$2']);

    let expected = new JmpInstruction(['$2']);

    expect(inst).toStrictEqual(expected);
});

test("create jmp instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("jmp", ['123']);

    let expected = new JmpImmediateInstruction(['123']);

    expect(inst).toStrictEqual(expected);
});

test("create jmp instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + registerOpCode;

    let expectedInstruction = new JmpInstruction(['$2']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("create jmp instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "000" + "000" + immediateOpCode + "0000000000001010";

    let expectedInstruction = new JmpImmediateInstruction(['10']);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);

    expect(instruction).toStrictEqual(expectedInstruction);
});

test("test execute jmp instruction", () => {
    let instruction = new JmpInstruction(['$2']);
    let mockSystem = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 0, 0, 10, 0, 0, 0, 0, 0], instruction)

    expectedSystemState.registers.pc.set(Word.fromSignedIntValue(9));

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute jmp instruction with immediate", () => {
    let instruction = new JmpImmediateInstruction(['12']);
    let mockSystem = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0], instruction)

    expectedSystemState.registers.pc.set(Word.fromSignedIntValue(11));

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});