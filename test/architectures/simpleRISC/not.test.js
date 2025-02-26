import {expect, test} from "vitest";
import {NotInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/system.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "NOT";
const opCode = "1000";

test(`${mnemonic} instruction to string`, () => {
    const instruction = new NotInstruction();
    expect(instruction.toString()).toBe(`${mnemonic}`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new NotInstruction();
    const expectedMachineCode = "000" + opCode + "0" + "00000000";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new NotInstruction([]);

    const instruction = factory.createFromMnemonic(mnemonic, [])

    expect(instruction).toStrictEqual(expectedInstruction);
});

test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new NotInstruction([]);

    const memory = [Word.fromString("000" + opCode + "0" + "00000000")];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});

test(`test execution of ${mnemonic} instruction`, () => {
    const instruction = new NotInstruction();

    const emulator = new SimpleRISCEmulator();
    emulator.registers.$ACC = Word.fromSignedIntValue(0);

    instruction.executeOn(emulator);

    expect(emulator.registers.$ACC.toSignedIntValue()).toBe(-1);
})