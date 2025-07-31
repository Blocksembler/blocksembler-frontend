import {expect, test} from "vitest";
import {ClearFlagsInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting clf instruction to machine code", () => {
    const clfInst = new ClearFlagsInstruction()

    expect(clfInst.toMachineCode()).toBe("01100000")
})

test("test creating clf instruction from machine code", () => {
    const machineCode = "01100000";

    const clfInst = ClearFlagsInstruction.fromMachineCode(Word.fromString(machineCode, 8), Word.fromSignedIntValue(0));

    expect(clfInst).toStrictEqual(new ClearFlagsInstruction());
})

test("test creating clf instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const clfInst = factory.createFromMnemonic("CLF", ["123"]);

    expect(clfInst).toStrictEqual(new ClearFlagsInstruction(["123"]));
});

test("test creating clf instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].value.set(Word.fromString("01100000", 8));
    mockSystem.memory[1].value.set(Word.fromString("00000000", 8));

    const clfInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(clfInst).toStrictEqual(new ClearFlagsInstruction());
});

test("test clear flags", () => {
    const mockSystem = new ScottEmulator()

    mockSystem.registers.flags = Word.fromString("1111", 4);

    const clfInst = new ClearFlagsInstruction();
    clfInst.executeOn(mockSystem);

    expect(mockSystem.registers.flags.toBitString()).toBe("0000");
});