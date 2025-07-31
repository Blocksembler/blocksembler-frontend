import {expect, test} from "vitest";
import {OrInstruction, SimpleRISCInstructionFactory, XorInstruction} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "XOR";
const opCode = "0111";

test(`${mnemonic} instruction to string`, () => {
    const instruction = new XorInstruction(['$1']);
    expect(instruction.toString()).toBe(`${mnemonic} $1`);
});

test(`${mnemonic} instruction with immediate to string`, () => {
    const instruction = new XorInstruction(['202']);
    expect(instruction.toString()).toBe(`${mnemonic} 202`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new XorInstruction(['$1']);
    const expectedMachineCode = "000" + opCode + "1" + "00000001";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`convert ${mnemonic} instruction with immediate to machine code`, () => {
    const instruction = new XorInstruction(['202']);
    const expectedMachineCode = "000" + opCode + "0" + "11001010";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new XorInstruction(['$1']);

    const instruction = factory.createFromMnemonic(mnemonic, ['$1'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new XorInstruction(['202']);

    const instruction = factory.createFromMnemonic(mnemonic, ['202'])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new XorInstruction(['$1']);

    const memory = [
        {address: 0, value: Word.fromString("000" + opCode + "1" + "00000001")}
    ];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction with immediate from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new XorInstruction(['255']);

    const memory = [
        {address: 0, value: Word.fromString("000" + opCode + "0" + "11111111")},
    ];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`test execution of ${mnemonic} instruction`, () => {
    const instruction = new OrInstruction(['$1']);

    const emulator = new SimpleRISCEmulator();
    emulator.registers.$ACC = Word.fromString('1111111111111111');
    emulator.registers.$1 = Word.fromString('1010101010101010');

    instruction.executeOn(emulator);

    expect(emulator.registers.$ACC.toBitString()).toBe("0101010101010101");
})