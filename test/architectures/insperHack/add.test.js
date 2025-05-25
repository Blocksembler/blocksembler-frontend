import { AddInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "@/architectures/system.js";

//add (%A), %D, %D
test("test add instruction to machine code", () => {
    let instruction = new AddInstruction(['(%A)', '%D', '%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = '111' + '1' + '000010' +'010' + '000';

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating add instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("add", ['(%A)', '%D', '%D']);
    let expected = new AddInstruction(['(%A)', '%D', '%D']);

    expect(inst).toMatchObject(expected);
});

test("add two registers and store to different register", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(17);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
    };

    let instruction = new AddInstruction(['%A', '%D', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(17);
    expect(regDWord.toSignedIntValue()).toBe(22);
});

test("add two registers and store to different register", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromSignedIntValue(5);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
            '%D': regDWord,
        },
        memory: [Word.fromSignedIntValue(10)],
    };

    let instruction = new AddInstruction(['(%A)', '%D', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(0);
    expect(regDWord.toSignedIntValue()).toBe(15);
});
