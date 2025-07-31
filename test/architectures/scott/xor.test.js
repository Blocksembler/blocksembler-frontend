import {expect, test} from "vitest";
import {ScottInstructionFactory, XorInstruction} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting xor instruction to machine code", () => {
    const xorInst = new XorInstruction(['r1', 'r2'])

    expect(xorInst.toMachineCode()).toBe("11100110")
})

test("test creating xor instruction from machine code", () => {
    const machineCode = "11101101";

    const xorInst = XorInstruction.fromMachineCode({
        address: 0,
        value: Word.fromString(machineCode, 8)
    });

    expect(xorInst).toStrictEqual(new XorInstruction(["R3", "R1"]));
})

test("test creating xor instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const xorInst = factory.createFromMnemonic("XOR", ["R1", "R2"]);

    expect(xorInst).toStrictEqual(new XorInstruction(["R1", "R2"]));
});

test("test creating xor instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].value.set(Word.fromString("11101101", 8));

    const xorInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(xorInst).toStrictEqual(new XorInstruction(["R3", "R1"]));
});

test("test bitwise xor operation on two registers", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromString("01001011", 8));
    mockSystem.registers.R2.set(Word.fromString("01001101", 8));
    const expected = "00000110"

    const xorInst = new XorInstruction(['R1', 'R2']);

    xorInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("01001011");
    expect(mockSystem.registers.R2.toBitString()).toBe(expected);
});

test("test setting zero flag after xor instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromString("01010001", 8));
    mockSystem.registers.R2.set(Word.fromString("01010001", 8));

    const xorInst = new XorInstruction(["R1", "R2"]);

    xorInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("01010001");
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});