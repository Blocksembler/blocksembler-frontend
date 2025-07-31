import {expect, test} from "vitest";
import {Word} from "@/architectures/emulator.ts";
import {HaltInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

const mnemonic = "HALT";
const opCode = "1111";

test(`${mnemonic} instruction to string`, () => {
    const instruction = new HaltInstruction();
    expect(instruction.toString()).toBe(`${mnemonic}`);
});

test(`convert ${mnemonic} instruction to machine code`, () => {
    const instruction = new HaltInstruction([]);
    const expectedMachineCode = "000" + opCode + "0" + "00000000";

    expect(instruction.toMachineCode()).toBe(expectedMachineCode);
});

test(`test creating ${mnemonic} instruction from mnemonic`, () => {
    const factory = new SimpleRISCInstructionFactory()
    const expectedInstruction = new HaltInstruction([]);

    const instruction = factory.createFromMnemonic(mnemonic, [])

    expect(instruction).toStrictEqual(expectedInstruction);
});


test(`create ${mnemonic} instruction from machine code`, () => {
    const factory = new SimpleRISCInstructionFactory();
    const expectedInstruction = new HaltInstruction([]);

    const memory = [
        {address: 0, value: Word.fromString("000" + opCode + "0" + "00000000")},
    ];

    expect(factory.createFromOpCode(memory, 0)).toStrictEqual(expectedInstruction);
});


test(`test executing ${mnemonic} instruction`, () => {
    const instruction = new HaltInstruction([]);

    const emulator = new SimpleRISCEmulator({
        'hlt': (system) => {
            system.callInterrupt('alert', 'The program terminated');
            system.halt();
        },
        'alert': (system, msg) => {
            console.log(msg);
        }
    })
    emulator.isTerminated = false;

    instruction.executeOn(emulator)
    expect(emulator.isTerminated).toBe(true);
})