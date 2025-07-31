import {expect, test} from "vitest";
import {DataInstruction, ScottInstructionFactory} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/emulator.ts";
import {ScottEmulator} from "@/architectures/scott/system.js";

test("test converting data instruction to machine code", () => {
    const dataInst = new DataInstruction(['r3', '123'])

    expect(dataInst.toMachineCode()).toBe("00100011" + "01111011")
})

test("test creating data instruction from machine code", () => {
    const machineCode = "00100011";
    const immediate = "1111011";

    const dataInst = DataInstruction.fromMachineCode(
        {address: 0, value: Word.fromString(machineCode, 8)},
        {address: 1, value: Word.fromString(immediate)}
    );

    expect(dataInst).toStrictEqual(new DataInstruction(["R3", "123"]));
})

test("test creating data instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const dataInst = factory.createFromMnemonic("DATA", ["R1", "123"]);

    expect(dataInst).toStrictEqual(new DataInstruction(["R1", "123"]));
});

test("test creating data instruction from opcode", () => {
    const factory = new ScottInstructionFactory();
    const mockSystem = new ScottEmulator()
    mockSystem.memory[0].value.set(Word.fromString("00100011", 8));
    mockSystem.memory[1].value.set(Word.fromString("1111011", 8));

    const dataInst = factory.createFromOpCode(mockSystem.memory, 0);

    expect(dataInst).toStrictEqual(new DataInstruction(["R3", "123"]));
});

test("test loading immediate to register", () => {
    const mockSystem = new ScottEmulator()
    mockSystem.registers.R1.set(Word.fromSignedIntValue(0, 8));

    const dataInst = new DataInstruction(['R1', '123']);

    dataInst.executeOn(mockSystem);

    expect(mockSystem.registers.R1.toUnsignedIntValue()).toBe(123);
});