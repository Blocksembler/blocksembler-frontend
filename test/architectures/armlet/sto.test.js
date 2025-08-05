import {expect, test} from "vitest";
import {ArmletInstructionFactory, StoInstruction} from "@/architectures/armlet/instructions.ts";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

let opCode = "001101"

test("sto instruction to string", () => {
    let instruction = new StoInstruction(['$4', '$7']);
    expect(instruction.toString()).toBe("sto $4, $7");
})

test("sto instruction to machine code", () => {
    let instruction = new StoInstruction(['$4', '$7']);
    let expectedCode = "0" + "000" + "111" + "100" + opCode;
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating sto instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("sto", ['$4', '$7']);
    let expected = new StoInstruction(['$4', '$7']);
    expect(inst).toMatchObject(expected);
});

test("create sto instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + opCode;
    let expectedInstruction = new StoInstruction(['$7', '$2']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 1, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute sto instruction", () => {
    let instruction = new StoInstruction(['$3', '$2']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 4, 1, 7, 7, 1], instruction)
    mockSystem.memory[4].value.set(Word.fromSignedIntValue(24))

    let expectedSystemState = generateMockSystem([0, 13, 17, 5, 4, 1, 7, 7, 1], instruction)
    mockSystem.memory[4].value.set(Word.fromSignedIntValue(5))

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
