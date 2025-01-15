import {expect, test} from "vitest";
import {ArmletInstructionFactory, TrpInstruction} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";

let opCode = "111110"

test("trp instruction to string", () => {
    let instruction = new TrpInstruction([]);
    expect(instruction.toString()).toBe("trp");
});

test("test trp instruction to machien code", () => {
    let instruction = new TrpInstruction([]);
    let expectedCode = "0000000000" + opCode;

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating trp instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("trp", []);

    let expected = new TrpInstruction([]);

    expect(inst).toMatchObject(expected);
});

test("create trp instruction from machine code", () => {

    let emulator = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0])

    let expectedInstruction = new TrpInstruction([]);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode(emulator.memory, 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute trp instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1])
    let instruction = new TrpInstruction();

    instruction.executeOn(mockSystem);

    expect(mockSystem.isPaused).toBe(true);
});
