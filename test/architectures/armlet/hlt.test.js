import {expect, test} from "vitest";
import {ArmletInstructionFactory, HltInstruction} from "@/architectures/armlet/instructions.js";
import {generateMockSystem} from "./util.js";

let opCode = "111111"

test("hlt instruction to string", () => {
    let instruction = new HltInstruction([]);
    expect(instruction.toString()).toBe("hlt");
});

test("test hlt instruction to machine code", () => {
    let instruction = new HltInstruction([]);
    let expectedCode = "0000000000" + opCode;

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating hlt instruction from mnemonic", () => {
    let factory = new ArmletInstructionFactory();

    let inst = factory.createFromMnemonic("hlt", []);

    let expected = new HltInstruction([]);

    expect(inst).toMatchObject(expected);
});

test("create hlt instruction from machine code", () => {

    let emulator = generateMockSystem([0, 0, 0, 0, 0, 0, 0, 0, 0])

    let expectedInstruction = new HltInstruction([]);

    let factory = new ArmletInstructionFactory();
    let instruction = factory.createFromOpCode(emulator.memory, 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test execute hlt instruction", () => {
    let mockSystem = generateMockSystem([0, 13, 17, 5, 3, 2, 67, 7, 1])
    mockSystem.interruptHandler['alert'] = (system, msg) => {
        console.log(msg);
    };

    let instruction = new HltInstruction();

    instruction.executeOn(mockSystem);

    expect(mockSystem.isTerminated).toBe(true);
});
