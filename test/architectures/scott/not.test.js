import {expect, test} from "vitest";
import {NotInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting not instruction to machine code", () => {
    const notInst = new NotInstruction(['r1', 'r2'])

    expect(notInst.toMachineCode()).toBe("10110110")
})

test("test creating not instruction from machine code", () => {
    const machineCode = "10111101";

    const notInst = NotInstruction.fromMachineCode(Word.fromString(machineCode, 8));

    expect(notInst).toStrictEqual(new NotInstruction(["R3", "R1"]));
})

test("test creating not instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const notInst = factory.createFromMnemonic("NOT", ["R1", "R2"]);

    expect(notInst).toStrictEqual(new NotInstruction(["R1", "R2"]));
});

test("test creating not instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("10111101", 8));

    const notInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(notInst).toStrictEqual(new NotInstruction(["R3", "R1"]));
});

test("test noting two registers", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromString("10101010", 8));

    const notInst = new NotInstruction(['R1', 'R2']);

    notInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toBitString()).toBe("10101010");
    expect(mockSystem.registers.R2.toBitString()).toBe("01010101");
});

test("test setting zero flag after not instruction", () => {
    const mockSystem = new ScottEmulator();
    mockSystem.registers.R1.set(Word.fromSignedIntValue(255, 8));

    const notInst = new NotInstruction(["R1", "R2"]);

    notInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(255);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(0);
    expect(mockSystem.registers.flags.toBitString()).toBe("1000");
});