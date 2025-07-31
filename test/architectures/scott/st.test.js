import {expect, test} from "vitest";
import {ScottInstructionFactory, StoreInstruction} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting st instruction to machine code", () => {
    const stInst = new StoreInstruction(['r1', 'r2'])

    expect(stInst.toMachineCode()).toBe("00010110")
})

test("test creating st instruction from machine code", () => {
    const machineCode = "00011101";

    const stInst = StoreInstruction.fromMachineCode({
        address: 0,
        value: Word.fromString(machineCode, 8)
    });

    expect(stInst).toStrictEqual(new StoreInstruction(["R3", "R1"]));
})

test("test creating st instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const stInst = factory.createFromMnemonic("ST", ["R1", "R2"]);

    expect(stInst).toStrictEqual(new StoreInstruction(["R1", "R2"]));
});

test("test creating st instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].value.set(Word.fromString("00011101", 8));

    const stInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(stInst).toStrictEqual(new StoreInstruction(["R3", "R1"]));
});

test("test storing value to memory", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(10, 8));
    mockSystem.registers.R2.set(Word.fromSignedIntValue(123, 8));

    mockSystem.memory[10].value.set(Word.fromSignedIntValue(1, 8));

    const stInst = new StoreInstruction(['R1', 'R2']);

    stInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(10);
    expect(mockSystem.registers.R2.toUnsignedIntValue()).toBe(123);
    expect(mockSystem.memory[10].value.toUnsignedIntValue()).toBe(123);
});