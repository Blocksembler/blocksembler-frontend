import { MovInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "@/architectures/system.js";


test("test mov instruction to machine code", () => {
    let instruction = new MovInstruction(['%A', '%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110000" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating mov instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("mov", ['%A', '%D']);
    let expected = new MovInstruction(['%A', '%D']);

    expect(inst).toMatchObject(expected);
});

test("create mov instruction from machine code", () => {
    let machineCode = "111" + "0" + "110000" + "010" + "000";

    let expectedInstruction = new MovInstruction(['%A', '%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("mov instruction: copy value to destinations", () => {
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

test("mov instruction: copy value from memory to destinations", () => {
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

test("mov instruction: copy immediate to destinations", () => {
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