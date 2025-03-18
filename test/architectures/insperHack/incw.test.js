import { IncAInstruction, IncDInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "../../../src/architectures/system";

//incw %A
test("Test 1: incA instruction to maschine code (a=0)", () => {
    let instruction = new IncAInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110111" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create incA instruction from machine code", () => {
    let machineCode = "111" + "0" + "110111" + "010" + "000";

    let expectedInstruction = new IncAInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating incA instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("incw", ['%A']);
    let expected = new IncAInstruction(['%A']);

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

    let instruction = new IncAInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(13);
    expect(regDWord.toSignedIntValue()).toBe(5);
});
// Test for Expected Errors 
test("Test 5: increment register A", () => {
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

    let instruction = new IncAInstruction(['(%A)']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(5);
});



//incw %D
test("Test 1: incD instruction to maschine code (a=0)", () => {
    let instruction = new IncDInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "011111" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create incD instruction from machine code", () => {
    let machineCode = "111" + "0" + "011111" + "010" + "000";

    let expectedInstruction = new IncDInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating incD instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("incw", ['%A']);
    let expected = new IncDInstruction(['%A']);

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

    let instruction = new IncDInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(6);
});
// Test for Expected Errors 
test("Test 5: increment register D", () => {
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

    let instruction = new IncDInstruction(['(%D)']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(5);
});


