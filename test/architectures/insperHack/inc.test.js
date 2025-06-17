import { IncInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test} from "vitest";
import {Word} from "@/architectures/system.js";

//inc %A
test("Test 1: inc-instruction to maschine code (inc %A)", () => {
    let instruction = new IncInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110111" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create inc-instruction from machine code (inc %A)", () => {
    let machineCode = "111" + "0" + "110111" + "100" + "000";

    let expectedInstruction = new IncInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating inc-instruction from mnemonic (inc %A)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("inc", ['%A']);
    let expected = new IncInstruction(['%A']);

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

    let instruction = new IncInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(13);
    expect(regDWord.toSignedIntValue()).toBe(5);
});



//inc %D
test("Test 1: inc-instruction to maschine code (inc %D)", () => {
    let instruction = new IncInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "011111" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create inc-instruction from machine code (inc %D)", () => {
    let machineCode = "111" + "0" + "011111" + "010" + "000";

    let expectedInstruction = new IncInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating inc-instruction from mnemonic (inc %D)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("inc", ['%D']);
    let expected = new IncInstruction(['%D']);

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

    let instruction = new IncInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(6);
});


