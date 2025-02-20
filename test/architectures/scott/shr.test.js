import {expect, test} from "vitest";
import {ScottInstructionFactory, ShiftRightInstruction} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

/**
 * Suppose we've decided the SHR instruction has:
 *   - Top nibble (bits 7..4) = 1010 (0xA) to indicate SHR
 *   - Bottom nibble (bits 3..0) = register code (0..3)
 *     to indicate which register is shifted.
 *
 * For example:
 *    1010 0010  (0xA2)  => SHR R2
 *    1010 0001  (0xA1)  => SHR R1
 *    1010 0011  (0xA3)  => SHR R3
 */

// 1) Test converting SHR instruction to machine code
test("test converting shr instruction to machine code", () => {
    const shrInst = new ShiftRightInstruction(["R1", "R2"]);

    expect(shrInst.toMachineCode()).toBe("10010110");
});

// 2) Test creating SHR instruction from machine code
test("test creating shr instruction from machine code", () => {
    // This corresponds to 1010 0001 => 0xA1 => SHR R1
    const machineCode = "10010110";
    const shrInst = ShiftRightInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(shrInst).toStrictEqual(new ShiftRightInstruction(["R1", "R2"]));
});

// 3) Test creating SHR instruction from mnemonic
test("test creating shr instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory();

    const shrInst = factory.createFromMnemonic("SHR", ["R1", "R3"]);

    expect(shrInst).toStrictEqual(new ShiftRightInstruction(["R1", "R3"]));
});

test("test creating shr instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator();

    mockSystem.memory[0].set(Word.fromString("10010110", 8));

    const shrInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(shrInst).toStrictEqual(new ShiftRightInstruction(["R1", "R2"]));
});

// 5) Test shifting a register right by one
test("test shifting a register right by one", () => {
    const mockSystem = new ScottEmulator();

    mockSystem.registers.R1.set(Word.fromSignedIntValue(8, 8));

    const shrInst = new ShiftRightInstruction(["R1", "R2"]);
    shrInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(8);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(4);
});

test("test carry flag after shr instruction", () => {
    const mockSystem = new ScottEmulator();

    mockSystem.registers.R1.set(Word.fromString("00000011", 8));

    const shrInst = new ShiftRightInstruction(["R1", "R1"]);
    shrInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(1);
    expect(mockSystem.registers.flags.toBitString()).toBe("0001");
});

test("test setting zero flag after shr instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromSignedIntValue(0, 8));

    mockSystem.registers.R1.set(Word.fromString("00000000", 8));

    const shrInst = new ShiftRightInstruction(["R1", "R1"]);
    shrInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});
