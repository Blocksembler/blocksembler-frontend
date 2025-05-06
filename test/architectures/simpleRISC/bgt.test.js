import {expect, test} from "vitest";
import {BranchIfGreaterThanInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/system.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "BGT"
const opCode = "1110"

test(`${mnemonic} instruction to string`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['$1']);
    expect(instruction.toString()).toBe(`${mnemonic} $1`);
});

test(`${mnemonic} instruction with immediate to string`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['202']);
    expect(instruction.toString()).toBe(`${mnemonic} 202`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['$1']);
    const expectedMachineCode = "000" + opCode + "1" + "00000001";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with immediate to machine code`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['202']);
    const expectedMachineCode = "000" + opCode + "0" + "11001010";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with negative immediate to machine code`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['255']);
    const expectedMachineCode = "000" + opCode + "0" + "11111111";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new BranchIfGreaterThanInstruction(['$1']);

    const instruction = factory.createFromMnemonic(mnemonic, ['$1'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new BranchIfGreaterThanInstruction(['202']);

    const instruction = factory.createFromMnemonic(mnemonic, ['202'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new BranchIfGreaterThanInstruction(['$1']);

    const memory = [Word.fromString("000" + opCode + "1" + "00000001")];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new BranchIfGreaterThanInstruction(['255']);

    const memory = [Word.fromString("000" + opCode + "0" + "11111111")];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`test execute ${mnemonic} instruction`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['255'])

    const emulator = new SimpleRISCEmulator();
    emulator.registers.STATUS_GT = Word.fromString("1", 1);
    emulator.registers.pc = Word.fromSignedIntValue(10);

    const expectedEmulatorState = new SimpleRISCEmulator()
    expectedEmulatorState.registers.STATUS_GT = Word.fromString("1", 1);
    expectedEmulatorState.registers.pc = Word.fromSignedIntValue(9);

    instruction.executeOn(emulator);

    expect(emulator.registers).toStrictEqual(expectedEmulatorState.registers);
});

test(`execute ${mnemonic} instruction with immediate`, () => {
    const instruction = new BranchIfGreaterThanInstruction(['$1'])

    const emulator = new SimpleRISCEmulator();
    emulator.registers.STATUS_GT = Word.fromString("1", 1);
    emulator.registers.$1 = Word.fromString("1111111111111111", 16);
    emulator.registers.pc = Word.fromSignedIntValue(10);

    const expectedEmulatorState = new SimpleRISCEmulator()
    expectedEmulatorState.registers.STATUS_GT = Word.fromString("1", 1);
    expectedEmulatorState.registers.$1 = Word.fromString("1111111111111111", 16);
    expectedEmulatorState.registers.pc = Word.fromSignedIntValue(9);

    instruction.executeOn(emulator);

    expect(emulator.registers).toStrictEqual(expectedEmulatorState.registers);
});