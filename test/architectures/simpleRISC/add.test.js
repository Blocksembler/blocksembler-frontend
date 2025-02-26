import {expect, test} from "vitest";
import {AddInstruction, SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";
import {Word} from "@/architectures/system.js";
import {SimpleRISCEmulator} from "@/architectures/simpleRISC/system.js";

test("add instruction to string", () => {
    let instruction = new AddInstruction(['$1']);
    expect(instruction.toString()).toBe("ADD $1");
})

test("add instruction with immediate to string", () => {
    let instruction = new AddInstruction(['123']);
    expect(instruction.toString()).toBe("ADD 123");
})

test("test add instruction to machine code", () => {
    let instruction = new AddInstruction(['$3']);
    let expectedCode = "000" + "0011" + "1" + "00000011"
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("add instruction with immediate to machine code", () => {
    let instruction = new AddInstruction(['202']);
    let expectedCode = "000" + "0011" + "0" + "11001010"
    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating add instruction from mnemonic", () => {
    let factory = new SimpleRISCInstructionFactory();
    let inst = factory.createFromMnemonic("ADD", ['$1']);
    let expected = new AddInstruction(['$1']);
    expect(inst).toMatchObject(expected);
});

test("create add instruction from machine code", () => {
    let machineCode = "000" + "0011" + "1" + "00000011"
    let expectedInstruction = new AddInstruction(['$3']);
    let factory = new SimpleRISCInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
});

test("create add instruction with immediate from machine code", () => {
    let machineCode = "000" + "0011" + "0" + "00111010"
    let expectedInstruction = new AddInstruction(['58']);
    let factory = new SimpleRISCInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode), Word.fromSignedIntValue(0)], 0);
    expect(instruction).toMatchObject(expectedInstruction);
})

test("test execute add instruction", () => {
    let instruction = new AddInstruction(['$1']);

    let mockSystem = new SimpleRISCEmulator();
    mockSystem.registers.$ACC = Word.fromSignedIntValue(1);
    mockSystem.registers.$1 = Word.fromSignedIntValue(3);

    let expectedSystemState = new SimpleRISCEmulator();
    expectedSystemState.registers.$ACC = Word.fromSignedIntValue(4);
    expectedSystemState.registers.$1 = Word.fromSignedIntValue(3);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
});

test("execute add instruction with immediate", () => {
    let instruction = new AddInstruction(['40']);

    let mockSystem = new SimpleRISCEmulator();
    mockSystem.registers.$ACC = Word.fromSignedIntValue(2);

    let expectedSystemState = new SimpleRISCEmulator();
    expectedSystemState.registers.$ACC = Word.fromSignedIntValue(42);

    instruction.executeOn(mockSystem);

    expect(mockSystem.registers).toStrictEqual(expectedSystemState.registers);
})
