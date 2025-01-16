import {expect, test} from "vitest";
import {AnnaInstructionFactory, LoadLowerImmedateInstruction} from "@/architectures/anna/instructions.js";
import {Word} from "@/architectures/system.js";

test("test load lower immediate instruction to machine code", () => {
    let instruction = new LoadLowerImmedateInstruction(["r1", 11]);
    let expectedCode = "0110001000001011";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test create load lower immediate instruction from mnemonic", () => {
    let mnemonic = "lli";
    let expectedInstruction = new LoadLowerImmedateInstruction(["r1", 3]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromMnemonic(mnemonic, ["r1", 3]);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test create load lower immediate instruction from machine code", () => {
    let machineCode = "0110001000000011";
    let expectedInstruction = new LoadLowerImmedateInstruction(["r1", 3]);

    let factory = new AnnaInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("test load lower immedate instruction", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let reg1Word = Word.fromString("0000000100000000");
    let immedate = 255;

    let mockSystem = {
        registers: {
            pc: pcWord,
            1: reg1Word,
        },
    };

    let instruction = new LoadLowerImmedateInstruction(["r1", `${immedate}`]);

    instruction.executeOn(mockSystem);

    expect(reg1Word.toSignedIntValue()).toBe(511);
});