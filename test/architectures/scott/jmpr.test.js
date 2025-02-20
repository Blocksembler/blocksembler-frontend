import {expect, test} from "vitest";
import {JumpRegisterInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting jmpr instruction to machine code", () => {
    const jmprInst = new JumpRegisterInstruction(['r3'])

    expect(jmprInst.toMachineCode()).toBe("00110011")
})

test("test creating jmpr instruction from machine code", () => {
    const machineCode = "00110011";

    const jmprInst = JumpRegisterInstruction.fromMachineCode(Word.fromString(machineCode, 8), Word.fromString("00000000"));

    expect(jmprInst).toStrictEqual(new JumpRegisterInstruction(["R3"]));
})

test("test creating jmpr instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const jmprInst = factory.createFromMnemonic("JMPR", ["R1"]);

    expect(jmprInst).toStrictEqual(new JumpRegisterInstruction(["R1"]));
});

test("test creating jmpr instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].set(Word.fromString("00110011", 8));
    mockSystem.memory[1].set(Word.fromString("00000000", 8));

    const jmprInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(jmprInst).toStrictEqual(new JumpRegisterInstruction(["R3"]));
});

test("test jump to address in register", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(123, 8));
    mockSystem.registers.pc.set(Word.fromSignedIntValue(0, 8));

    const jmprInst = new JumpRegisterInstruction(['R1']);

    jmprInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(123);
    expect(mockSystem.registers.pc.toUnsignedIntValue()).toBe(123 - 1);
});