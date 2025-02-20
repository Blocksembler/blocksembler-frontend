import {expect, test} from "vitest";
import {ScottInstructionFactory, ShiftLeftInstruction} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";


test("test converting shl instruction to machine code", () => {
    const shlInst = new ShiftLeftInstruction(["R1", "R2"]);

    expect(shlInst.toMachineCode()).toBe("10100110");
});

// 2) Test creating SHR instruction from machine code
test("test creating shl instruction from machine code", () => {
    // This corresponds to 1010 0001 => 0xA1 => SHR R1
    const machineCode = "10100110";
    const shlInst = ShiftLeftInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(shlInst).toStrictEqual(new ShiftLeftInstruction(["R1", "R2"]));
});

// 3) Test creating SHR instruction from mnemonic
test("test creating shl instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory();

    const shlInst = factory.createFromMnemonic("SHL", ["R1", "R3"]);

    expect(shlInst).toStrictEqual(new ShiftLeftInstruction(["R1", "R3"]));
});

test("test creating shl instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator();

    mockSystem.memory[0].set(Word.fromString("10100110", 8));

    const shlInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(shlInst).toStrictEqual(new ShiftLeftInstruction(["R1", "R2"]));
});

// 5) Test shifting a register right by one
test("test shifting a register right by one", () => {
    const mockSystem = new ScottEmulator();

    mockSystem.registers.R1.set(Word.fromSignedIntValue(8, 8));

    const shlInst = new ShiftLeftInstruction(["R1", "R2"]);
    shlInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(8);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(16);
});

test("test carry flag after shl instruction", () => {
    const mockSystem = new ScottEmulator();

    mockSystem.registers.R1.set(Word.fromString("11000000", 8));

    const shlInst = new ShiftLeftInstruction(["R1", "R1"]);
    shlInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(128);
    expect(mockSystem.registers.flags.toBitString()).toBe("0001");
});

test("test setting zero flag after shl instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromSignedIntValue(0, 8));

    mockSystem.registers.R1.set(Word.fromString("00000000", 8));

    const shlInst = new ShiftLeftInstruction(["R1", "R1"]);
    shlInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});
