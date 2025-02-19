import {expect, test} from "vitest";
import {OrInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting or instruction to machine code", () => {
    const orInst = new OrInstruction(['r1', 'r2'])

    expect(orInst.toMachineCode()).toBe("11010110")
})

test("test creating or instruction from machine code", () => {
    const machineCode = "11011101";

    const orInst = OrInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(orInst).toStrictEqual(new OrInstruction(["R3", "R1"]));
})

test("test creating or instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const orInst = factory.createFromMnemonic("OR", ["R1", "R2"]);

    expect(orInst).toStrictEqual(new OrInstruction(["R1", "R2"]));
});

test("test creating or instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("11011101", 8));

    const orInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(orInst).toStrictEqual(new OrInstruction(["R3", "R1"]));
});

test("test bitwise or operation on two registers", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromString("01001011", 8));
    mockSystem.registers.R2.set(Word.fromString("01001101", 8));
    const expected = "01001111"

    const orInst = new OrInstruction(['R1', 'R2']);

    orInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("01001011");
    expect(mockSystem.registers.R2.toBitString()).toBe(expected);
});

test("test setting zero flag after or instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromString("00000000", 8));
    mockSystem.registers.R2.set(Word.fromString("00000000", 8));

    const orInst = new OrInstruction(["R1", "R2"]);

    orInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("00000000");
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});