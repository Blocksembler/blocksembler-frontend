import {expect, test} from "vitest";
import {AddInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting add instruction to machine code", () => {
    const addInst = new AddInstruction(['r1', 'r2'])

    expect(addInst.toMachineCode()).toBe("10000110")
})

test("test creating add instruction from machine code", () => {
    const machineCode = "10001101";

    const addInst = AddInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(addInst).toStrictEqual(new AddInstruction(["R3", "R1"]));
})

test("test creating add instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const addInst = factory.createFromMnemonic("ADD", ["R1", "R2"]);

    expect(addInst).toStrictEqual(new AddInstruction(["R1", "R2"]));
});

test("test creating add instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("10001101", 8));

    const addInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(addInst).toStrictEqual(new AddInstruction(["R3", "R1"]));
});

test("test adding two registers", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(3));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(10));

    const addInst = new AddInstruction(['R1', 'R2']);

    addInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(3);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(13);
});

test("test overflowing add instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromSignedIntValue(2, 8));
    mockSystem.registers.R2.set(Word.fromString("11111111", 8));

    const addInst = new AddInstruction(["R1", "R2"]);

    addInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(2);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(1);
    expect(mockSystem.registers.flags.toBitString()).toBe("0001");
});

test("test setting zero flag after add instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromSignedIntValue(0, 8));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(0, 8));

    const addInst = new AddInstruction(["R1", "R2"]);

    addInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});