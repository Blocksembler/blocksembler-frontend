import {DecInstruction, InsperHackInstructionFactory} from "@/architectures/insperHack/instructions";
import {expect, test} from "vitest";
import {Word} from "@/architectures/emulator";

//dec %A
test("Test 1: dec instruction to maschine code (dec %A)", () => {
    let instruction = new DecInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110010" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create dec instruction from machine code (dec %A)", () => {
    let machineCode = "111" + "0" + "110010" + "010" + "000";

    let expectedInstruction = new DecInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating dec instruction from mnemonic (dec %A)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("dec", ['%A']);
    let expected = new DecInstruction(['%A']);

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

    let instruction = new DecInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(11);
    expect(regDWord.toSignedIntValue()).toBe(5);
});


//dec %D
test("Test 1: dec instruction to maschine code (dec %D)", () => {
    let instruction = new DecInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "001110" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create dec instruction from machine code (dec %D)", () => {
    let machineCode = "111" + "0" + "001110" + "010" + "000";

    let expectedInstruction = new DecInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});

test("Test 3: creating dec instruction from mnemonic (dec %D)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("dec", ['%A']);
    let expected = new DecInstruction(['%A']);

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

    let instruction = new DecInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(12);
    expect(regDWord.toSignedIntValue()).toBe(4);
});


