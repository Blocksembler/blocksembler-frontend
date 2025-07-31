import {InsperHackInstructionFactory, NegInstruction} from "@/architectures/insperHack/instructions";
import {expect, test} from "vitest";
import {Word} from "@/architectures/emulator.ts";

//neg %A
test("Test 1: neg-instruction to maschine code (neg %A)", () => {
    let instruction = new NegInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110011" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create neg-instruction from machine code (neg %A)", () => {
    let machineCode = "111" + "0" + "110011" + "100" + "000";

    let expectedInstruction = new NegInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating neg-instruction from mnemonic (neg %A)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("neg", ['%A']);
    let expected = new NegInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromSignedIntValue(10);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
        },
    };

    let instruction = new NegInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(-10);
});


//neg %D
test("Test 1: neg-instruction to maschine code (neg %D)", () => {
    let instruction = new NegInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "001111" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create neg-instruction from machine code (neg %D)", () => {
    let machineCode = "111" + "0" + "001111" + "010" + "000";

    let expectedInstruction = new NegInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating neg-instruction from mnemonic (neg %D)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("neg", ['%D']);
    let expected = new NegInstruction(['%D']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register D", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromSignedIntValue(10);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%D': regDWord,
        },
    };

    let instruction = new NegInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regDWord.toSignedIntValue()).toBe(-10);
});

