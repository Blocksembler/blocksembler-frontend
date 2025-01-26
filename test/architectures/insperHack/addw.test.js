import { AddwInstruction } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "../../../src/architectures/system";

//addw (%A), %D, %D
test("test addw instruction to machine code", () => {
    let instruction = new AddwInstruction(['(%A)', '%D', '%D']);
    // 111a cccc ccdd djjj
    let expectedCode = "1111" + "0000" + "1001" + "0000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});

test("test creating addw instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("addw", ['(%A)', '%D', '%D']);
    let expected = new AddwInstruction(['(%A)', '%D', '%D']);

    expect(inst).toMatchObject(expected);
});

test("create addw instruction from machine code", () => {
    let machineCode = "1111" + "0000" + "1001" + "0000";

    let expectedInstruction = new AddwInstruction(['(%A)', '%D', '%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(maschineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
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

    let instruction = new AddwInstruction(['%A', '%D', '%D']);

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

    let instruction = new AddwInstruction(['(%A)', '%D', '%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(0);
    expect(regDWord.toSignedIntValue()).toBe(15);
});
