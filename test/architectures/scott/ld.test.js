import {expect, test} from "vitest";
import {LoadInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting ld instruction to machine code", () => {
    const ldInst = new LoadInstruction(['r1', 'r2'])

    expect(ldInst.toMachineCode()).toBe("00000110")
})

test("test creating ld instruction from machine code", () => {
    const machineCode = "00001101";

    const ldInst = LoadInstruction.fromMachineCode({
        address: 0,
        value: Word.fromString(machineCode, 8)
    });

    expect(ldInst).toStrictEqual(new LoadInstruction(["R3", "R1"]));
})

test("test creating ld instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const ldInst = factory.createFromMnemonic("LD", ["R1", "R2"]);

    expect(ldInst).toStrictEqual(new LoadInstruction(["R1", "R2"]));
});

test("test creating ld instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].value.set(Word.fromString("00001101", 8));

    const ldInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(ldInst).toStrictEqual(new LoadInstruction(["R3", "R1"]));
});

test("test loading value from memory", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(10, 8));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(0, 8));

    mockSystem.memory[10].value.set(Word.fromSignedIntValue(123, 8));

    const ldInst = new LoadInstruction(['R1', 'R2']);

    ldInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(10);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(123);
});