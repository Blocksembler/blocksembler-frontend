import {expect, test} from "vitest";
import {ArmletInstructionFactory, NegInstruction} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";
import {Word} from "@/architectures/system.js";


test("neg instruction to string", () => {
    let instruction = new NegInstruction(['$3', '$6']);
    expect(instruction.toString()).toBe("neg $3, $6");
})

test("neg instruction with immediate to string", () => {
    let instruction = new NegInstruction(['$3', '10']);
    expect(instruction.toString()).toBe("neg $3, 10");
})

test("test neg instruction to machine code", () => {
    let instruction = new NegInstruction(['$3', '$6']);
    let expectedCode = "0" + "000" + "110" + "011" + "001000";
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating neg instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();
    let inst = factory.createFromMnemonic("neg", ['$1', '$2']);
    let expected = new NegInstruction(['$1', '$2']);
    expect(inst).toMatchObject(expected);
});

test("create neg instruction from machine code", () => {
    let machineCode = "0" + "000" + "110" + "011" + "001000";
    let expectedInstruction = new NegInstruction(['$3', '$6']);
    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute neg instruction", () => {
    let instruction = new NegInstruction(['$3', '$4']);
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 234, 67, 7, 1], instruction)
    let expectedSystemState = generateMockSystem([0, 13, 17, 5, -234, 234, 67, 7, 1], instruction)

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});
