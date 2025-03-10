import { DecAInstruction, DecDInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "../../../src/architectures/system";

//incw %A
test("Test 1: DecA instruction to maschine code (a=0)", () => {
    let instruction = new DecAInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110010" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create DecA instruction from machine code", () => {
    let machineCode = "111" + "0" + "110010" + "010" + "000";

    let expectedInstruction = new DecAInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating DecA instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("incw", ['%A']);
    let expected = new DecAInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: increment register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(12);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
    };

    let instruction = new DecAInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(11);
    expect(regDWord.toSignedIntValue()).toBe(5);
});
// Test for Expected Errors 
test("Test 4: increment register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(12);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
    };

    let instruction = new DecAInstruction(['(%A)']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(5);
});




//incw %D
test("Test 1: DecD instruction to maschine code (a=0)", () => {
    let instruction = new DecDInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "001110" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create DecD instruction from machine code", () => {
    let machineCode = "111" + "0" + "001110" + "010" + "000";

    let expectedInstruction = new DecDInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating DecD instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("incw", ['%A']);
    let expected = new DecDInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: increment register D", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(12);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
    };

    let instruction = new DecDInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(4);
});
// Test for Expected Errors 
test("Test 4: increment register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(12);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
    };

    let instruction = new DecAInstruction(['(%D)']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(5);
});


