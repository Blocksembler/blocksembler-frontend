import {expect, test} from "vitest";
import {SimpleRISCInstructionFactory, SubInstruction} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/system.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "SUB";
const opCode = "0100";

test(`${mnemonic} instruction to string`, () => {
    const instruction = new SubInstruction(['$1']);
    expect(instruction.toString()).toBe(`${mnemonic} $1`);
});

test(`${mnemonic} instruction with immediate to string`, () => {
    const instruction = new SubInstruction(['202']);
    expect(instruction.toString()).toBe(`${mnemonic} 202`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new SubInstruction(['$1']);
    const expectedMachineCode = "000" + opCode + "1" + "00000001";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with immediate to machine code`, () => {
    const instruction = new SubInstruction(['202']);
    const expectedMachineCode = "000" + opCode + "0" + "11001010";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new SubInstruction(['$1']);

    const instruction = factory.createFromMnemonic(mnemonic, ['$1'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new SubInstruction(['202']);

    const instruction = factory.createFromMnemonic(mnemonic, ['202'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new SubInstruction(['$1']);

    const memory = [Word.fromString("000" + opCode + "1" + "00000001")];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new SubInstruction(['255']);

    const memory = [Word.fromString("000" + opCode + "0" + "11111111")];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`test execution of ${mnemonic} instruction`, () => {
    const instruction = new SubInstruction(['8']);

    const emulator = new SimpleRISCEmulator();
    emulator.registers.$ACC = Word.fromSignedIntValue(50);

    instruction.executeOn(emulator);

    expect(emulator.registers.$ACC.toSignedIntValue()).toBe(42)
})