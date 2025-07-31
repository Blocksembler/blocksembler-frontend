import {expect, test} from "vitest";
import {ArmletInstructionFactory, LoaInstruction} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

let opCode = "001100"

test("loa instruction to string", () => {
    let instruction = new LoaInstruction(['$4', '$7']);
    expect(instruction.toString()).toBe("loa $4, $7");
})

test("loa instruction to machine code", () => {
    let instruction = new LoaInstruction(['$4', '$7']);
    let expectedCode = "0" + "000" + "111" + "100" + opCode;
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating loa instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("loa", ['$4', '$7']);
    let expected = new LoaInstruction(['$4', '$7']);
    expect(inst).toMatchObject(expected);
});

test("create loa instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + opCode;
    let expectedInstruction = new LoaInstruction(['$7', '$2']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 0, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute loa instruction", () => {
    let instruction = new LoaInstruction(['$2', '$3']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 4, 1, 7, 7, 1], instruction)
    mockSystem.memory[4].value.set(Word.fromSignedIntValue(24))

    let expectedSystemState = generateMockSystem([0, 13, 17, 24, 4, 1, 7, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
