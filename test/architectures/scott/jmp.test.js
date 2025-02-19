import {expect, test} from "vitest";
import {JumpInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting jmp instruction to machine code", () => {
    const jmpInst = new JumpInstruction(['123'])

    expect(jmpInst.toMachineCode()).toBe("01000000" + "01111011")
})

test("test creating jmp instruction from machine code", () => {
    const machineCode = "01000000";
    const immediate = "01111011";

    const jmpInst = JumpInstruction.fromMachineCode(Word.fromString(machineCode, 8), Word.fromString(immediate));

    expect(jmpInst).toStrictEqual(new JumpInstruction(["123"]));
})

test("test creating jmp instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const jmpInst = factory.createFromMnemonic("jmp", ["123"]);

    expect(jmpInst).toStrictEqual(new JumpInstruction(["123"]));
});

test("test creating jmp instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("01000000", 8));
    mockSystem.memory[1].set(Word.fromString("01111011", 8));

    const jmpInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(jmpInst).toStrictEqual(new JumpInstruction(["123"]));
});

test("test jump to address", () => {
    const mockSystem = new ScottEmulator()

    const jmpInst = new JumpInstruction(['123']);

    jmpInst.executeOn(mockSystem);

    expect(mockSystem.registers.pc.toUnsignedIntValue()).toBe(123 - 1);
});