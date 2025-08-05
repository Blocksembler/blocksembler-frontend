import {expect, test} from "vitest";
import {ArmletInstructionFactory, NotInstruction} from "@/architectures/armlet/instructions.ts";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/emulator.ts";

test("not instruction to string", () => {
    let instruction = new NotInstruction(['$4', '$7']);
    expect(instruction.toString()).toBe("not $4, $7");
})

test("not instruction to machine code", () => {
    let instruction = new NotInstruction(['$4', '$7']);
    let expectedCode = "0" + "000" + "111" + "100" + "000101";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating not instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("not", ['$4', '$7']);
    let expected = new NotInstruction(['$4', '$7']);
    expect(inst).toMatchObject(expected);
});

test("create not instruction from machine code", () => {
    let machineCode = "0" + "000" + "010" + "111" + "000101";
    let expectedInstruction = new NotInstruction(['$7', '$2']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)},
        {address: 0, value: Word.fromSignedIntValue(0)},
    ], 0);
    expect(instruction).toMatchObject(expectedInstruction);
})
;

test("test execute not instruction", () => {
    let instruction = new NotInstruction(['$2', '$4']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 25301, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, 40234, 3, 25301, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
