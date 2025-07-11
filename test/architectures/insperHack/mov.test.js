import { MovInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test} from "vitest";
import {Word} from "@/architectures/system.js";


test("Test 1: mov-instruction to machine code (mov %A %D)", () => {
    let instruction = new MovInstruction(['%A', '%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110000" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("Test 2: creating mov-instruction from mnemonic (mov %A %D)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("mov", ['%A', '%D']);
    let expected = new MovInstruction(['%A', '%D']);

    expect(inst).toMatchObject(expected);
});

test("Test 3: create mov-instruction from machine code (mov %A %D)", () => {
    let machineCode = "111" + "0" + "110000" + "010" + "000";

    let expectedInstruction = new MovInstruction(['%A', '%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("Test 4: copy value to destinations", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(1);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
        memory: [Word.fromSignedIntValue(10)],
    };

    let instruction = new MovInstruction(['%A', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(1); 
    expect(regDWord.toSignedIntValue()).toBe(1);
});
test("Test 5: copy value from memory to destinations", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromSignedIntValue(4);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
        memory: [Word.fromSignedIntValue(10)],
    };

    let instruction = new MovInstruction(['(%A)', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(0); 
    expect(regDWord.toSignedIntValue()).toBe(10);
});

test("Test 6: copy immediate to destinations", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(5);
    let regDWord = Word.fromSignedIntValue(4);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
        memory: [Word.fromSignedIntValue(10)],
    };

    let instruction = new MovInstruction(['$1', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(5); 
    expect(regDWord.toSignedIntValue()).toBe(1);
});