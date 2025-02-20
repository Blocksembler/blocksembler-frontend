import {expect, test} from "vitest";
import {CmpInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting cmp instruction to machine code", () => {
    const cmpInst = new CmpInstruction(['r1', 'r2'])

    expect(cmpInst.toMachineCode()).toBe("11110110")
})

test("test creating cmp instruction from machine code", () => {
    const machineCode = "11111101";

    const cmpInst = CmpInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(cmpInst).toStrictEqual(new CmpInstruction(["R3", "R1"]));
})

test("test creating cmp instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const cmpInst = factory.createFromMnemonic("CMP", ["R1", "R2"]);

    expect(cmpInst).toStrictEqual(new CmpInstruction(["R1", "R2"]));
});

test("test creating cmp instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("11111101", 8));

    const cmpInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(cmpInst).toStrictEqual(new CmpInstruction(["R3", "R1"]));
});

test("test a larger than b", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(10, 8));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(2, 8));
    const expected = "0010"

    const cmpInst = new CmpInstruction(['R1', 'R2']);

    cmpInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(10);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(2);
    expect(mockSystem.registers.flags.toBitString()).toBe(expected);
});

test("test a equal b", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(10, 8));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(10, 8));
    const expected = "0100"

    const cmpInst = new CmpInstruction(['R1', 'R2']);

    cmpInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(10);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(10);
    expect(mockSystem.registers.flags.toBitString()).toBe(expected);
});