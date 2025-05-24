import { notAInstruction, notDInstruction, InsperHackInstructionFactory } from "@/architectures/insperHack/instructions";
import {expect, test, vi} from "vitest";
import {Word} from "../../../src/architectures/system";

//notw %A
test("Test 1: notA instruction to maschine code (a=0)", () => {
    let instruction = new notAInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110001" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create notA instruction from machine code", () => {
    let machineCode = "111" + "0" + "110001" + "100" + "000";

    let expectedInstruction = new notAInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating notA instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("notw", ['%A']);
    let expected = new notAInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromString("101010101010");

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
        },
    };

    let instruction = new notAInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toString()).toBe("010101010101");
});
// Test for Expected Errors 
test("Test 5: negate register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromString("101010101010");

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
        },
    };

    let instruction = new notAInstruction(['(%A)']);

    instruction.executeOn(emulator);

    expect(regAWord.toString()).toBe("010101010101");
});



//notw %D
test("Test 1: notD instruction to maschine code (a=0)", () => {
    let instruction = new notDInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "001101" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create notD instruction from machine code", () => {
    let machineCode = "111" + "0" + "001101" + "010" + "000";

    let expectedInstruction = new notDInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([Word.fromString(machineCode)], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating notD instruction from mnemonic", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("notw", ['%A']);
    let expected = new notDInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register D", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromString("101010101010");

    let emulator = {
        registers: {
            'pc': pcWord,
            '%D': regDWord,
        },
    };

    let instruction = new notDInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regDWord.toString()).toBe("010101010101");
});
// Test for Expected Errors 
test("Test 5: negate register D", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromSignedIntValue(12);

    let emulator = {
        registers: {
            'pc': pcWord,
            '%D': regDWord,
        },
    };

    let instruction = new notDInstruction(['(%D)']);

    instruction.executeOn(emulator);

    expect(regDWord.toSignedIntValue()).toBe(12);
});


