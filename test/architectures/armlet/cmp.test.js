import {expect, test} from "vitest";
import {
    ArmletInstructionFactory,
    CmpImmediateInstruction,
    CmpInstruction
} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";

let registerOpCode = "001110"
let immediateOpCode = "100011"

test("cmp instruction to string", () => {
    let instruction = new CmpInstruction(['$1', '$2']);
    expect(instruction.toString()).toBe("cmp $1, $2");
})

test("cmp instruction with immediate to string", () => {
    let instruction = new CmpInstruction(['$1', '10']);
    expect(instruction.toString()).toBe("cmp $1, 10");
})

test("test cmp instruction to machine code", () => {
    let instruction = new CmpInstruction(['$1', '$2']);
    let expectedCode = "0" + "010" + "001" + "000" + registerOpCode;
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("cmp instruction with immediate to machine code", () => {
    let instruction = new CmpImmediateInstruction(['$1', '10']);
    let expectedCode = "0" + "000" + "001" + "000" + immediateOpCode + "0000000000001010";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating cmp instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("cmp", ['$1', '$2']);
    let expected = new CmpInstruction(['$1', '$2']);
    expect(inst).toMatchObject(expected);
});

test("create cmp instruction with immediate from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("cmp", ['$1', '10']);
    let expected = new CmpImmediateInstruction(['$1', '10']);
    expect(inst).toMatchObject(expected);
})

test("create cmp instruction from machine code", () => {
    let machineCode = "0" + "011" + "010" + "000" + registerOpCode;
    let expectedInstruction = new CmpInstruction(['$2', '$3']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("create cmp instruction with immediate from machine code", () => {
    let machineCode = "0" + "000" + "010" + "000" + immediateOpCode + "0000000000001010";
    let expectedInstruction = new CmpImmediateInstruction(['$2', '10']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
})

test("compare two numbers where a == b", () => {
    let instruction = new CmpInstruction(['$0', '$1']);
    let mockSystem = generateMockSystem([0, 2, 2, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 2, 2, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('001', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("compare two numbers where a > b (a and b are signed values)", () => {
    let instruction = new CmpInstruction(['$0', '$1']);
    let mockSystem = generateMockSystem([0, 2, -1, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 2, -1, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('010', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("compare two numbers where a > b (a and b are unsigned values)", () => {
    let instruction = new CmpInstruction(['$0', '$1']);
    let mockSystem = generateMockSystem([0, 2, 1, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 2, 1, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('110', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("compare two numbers where a == 2", () => {
    let instruction = new CmpImmediateInstruction(['$0', '2']);
    let mockSystem = generateMockSystem([0, 2, 0, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 2, 0, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('001', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("compare two numbers where a > 2 (both signed values)", () => {
    let instruction = new CmpImmediateInstruction(['$0', parseInt('1111111111111111', 2).toString()]);
    let mockSystem = generateMockSystem([0, 4, 0, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 4, 0, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('010', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("compare two numbers where a > 2 (both unsigned values)", () => {
    let instruction = new CmpImmediateInstruction(['$0', '1']);
    let mockSystem = generateMockSystem([0, 3, 0, 0, 0, 0, 0, 0, 0], instruction)
    let expectedSystemState = generateMockSystem([0, 3, 0, 0, 0, 0, 0, 0, 0], instruction)
    expectedSystemState.registers.status.set(Word.fromString('110', 3))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});