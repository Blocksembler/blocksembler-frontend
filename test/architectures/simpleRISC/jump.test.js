import {expect, test} from "vitest";
import {JumpInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "JUMP";
const opCode = "1100";

test(`${mnemonic} instruction to string`, () => {
    const instruction = new JumpInstruction(['$1']);
    expect(instruction.toString()).toBe(`${mnemonic} $1`);
});

test(`${mnemonic} instruction with immediate to string`, () => {
    const instruction = new JumpInstruction(['202']);
    expect(instruction.toString()).toBe(`${mnemonic} 202`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new JumpInstruction(['$1']);
    const expectedMachineCode = "000" + opCode + "1" + "00000001";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with immediate to machine code`, () => {
    const instruction = new JumpInstruction(['202']);
    const expectedMachineCode = "000" + opCode + "0" + "11001010";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with negative immediate to machine code`, () => {
    const instruction = new JumpInstruction(['255']);
    const expectedMachineCode = "000" + opCode + "0" + "11111111";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new JumpInstruction(['$1']);

    const instruction = factory.createFromMnemonic(mnemonic, ['$1'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new JumpInstruction(['202']);

    const instruction = factory.createFromMnemonic(mnemonic, ['202'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new JumpInstruction(['$1']);

    const memory = [
        {address: 0, value: Word.fromString("000" + opCode + "1" + "00000001")},
    ];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new JumpInstruction(['255']);

    const memory = [
        {address: 0, value: Word.fromString("000" + opCode + "0" + "11111111")}
    ];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`test execution of ${mnemonic} instruction`, () => {
    const instruction = new JumpInstruction(['255']);

    const emulator = new SimpleRISCEmulator();
    emulator.registers.pc = Word.fromSignedIntValue(10);

    instruction.executeOn(emulator);

    expect(emulator.registers.pc.toSignedIntValue()).toBe(9);
})