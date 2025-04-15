import {expect, test} from "vitest";
import {AndInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/system.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

test("and instruction to string", () => {
    let instruction = new AndInstruction(['$1']);
    expect(instruction.toString()).toBe("AND $1");
});

test("and instruction with immediate to string", () => {
    let instruction = new AndInstruction(['202']);
    expect(instruction.toString()).toBe("AND 202");
});

test("convert and instruction to machine code", () => {
    let instruction = new AndInstruction(['$1']);

    let expectedCode = "000" + "0101" + "1" + "00000001"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("convert and instruction with immediate to machine code", () => {
    let instruction = new AndInstruction(['202']);

    let expectedCode = "000" + "0101" + "0" + "11001010"

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating and instruction from mnemonic", () => {
    let factory = new SimpleRISCInstructionFactory();

    let inst = factory.createFromMnemonic("AND", ['$1']);

    let expected = new AndInstruction(['$1']);

    expect(inst).toStrictEqual(expected);
});

test("create and instruction with immediate from mnemonic", () => {
    let factory = new SimpleRISCInstructionFactory();

    let inst = factory.createFromMnemonic("AND", ['202']);

    let expected = new AndInstruction(['202']);

    expect(inst).toStrictEqual(expected);
});

test("create and instruction from machine code", () => {
    let machineCode = "000" + "0101" + "1" + "00000001";

    let expectedInstruction = new AndInstruction(['$1']);

    let factory = new SimpleRISCInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("create and instruction with immediate from machine code", () => {
    let machineCode = "000" + "0101" + "0" + "00111010";

    let expectedInstruction = new AndInstruction(['58']);

    let factory = new SimpleRISCInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(10)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute and instruction", () => {
    let instruction = new AndInstruction(['$1']);
    let mockSystem = new SimpleRISCEmulator()
    mockSystem.registers.$ACC = Word.fromString("1010101010101010", 16)
    mockSystem.registers.$1 = Word.fromString("0000000011111111", 16)

    let expectedSystemState = new SimpleRISCEmulator()
    expectedSystemState.registers.$ACC = Word.fromString("0000000010101010", 16)
    expectedSystemState.registers.$1 = Word.fromString("0000000011111111", 16)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute and instruction with immediate", () => {
    let instruction = new AndInstruction(['255']);
    let mockSystem = new SimpleRISCEmulator()
    mockSystem.registers.$ACC = Word.fromString("1010101010101010", 16)

    let expectedSystemState = new SimpleRISCEmulator()
    expectedSystemState.registers.$ACC = Word.fromString("0000000010101010", 16)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});