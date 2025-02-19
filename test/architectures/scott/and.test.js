import {expect, test} from "vitest";
import {AndInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting and instruction to machine code", () => {
    const andInst = new AndInstruction(['r1', 'r2'])

    expect(andInst.toMachineCode()).toBe("11000110")
})

test("test creating and instruction from machine code", () => {
    const machineCode = "11001101";

    const andInst = AndInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(andInst).toStrictEqual(new AndInstruction(["R3", "R1"]));
})

test("test creating and instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const andInst = factory.createFromMnemonic("AND", ["R1", "R2"]);

    expect(andInst).toStrictEqual(new AndInstruction(["R1", "R2"]));
});

test("test creating and instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("11001101", 8));

    const andInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(andInst).toStrictEqual(new AndInstruction(["R3", "R1"]));
});

test("test bitwise and operation on two registers", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromString("01001011", 8));
    mockSystem.registers.R2.set(Word.fromString("01001101", 8));
    const expected = "01001001"

    const andInst = new AndInstruction(['R1', 'R2']);

    andInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("01001011");
    expect(mockSystem.registers.R2.toBitString()).toBe(expected);
});

test("test setting zero flag after and instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromString("10101010", 8));
    mockSystem.registers.R2.set(Word.fromString("01010101", 8));

    const andInst = new AndInstruction(["R1", "R2"]);

    andInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("10101010");
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});