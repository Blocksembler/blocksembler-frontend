import {InsperHackInstructionFactory, NotInstruction} from "@/architectures/insperHack/instructions";
import {expect, test} from "vitest";
import {Word} from "@/architectures/emulator";

//not %A
test("Test 1: not-instruction to maschine code (not %A)", () => {
    let instruction = new NotInstruction(['%A']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "110001" + "100" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create not-instruction from machine code (not %A)", () => {
    let machineCode = "111" + "0" + "110001" + "100" + "000";

    let expectedInstruction = new NotInstruction(['%A']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating not-instruction from mnemonic (not %A)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("not", ['%A']);
    let expected = new NotInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register A", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regAWord = Word.fromString("1010101010101010");

    let emulator = {
        registers: {
            'pc': pcWord,
            '%A': regAWord,
        },
    };

    let instruction = new NotInstruction(['%A']);

    instruction.executeOn(emulator);

    expect(regAWord.toSignedIntValue()).toBe(
        Word.fromString("0101010101010101").toSignedIntValue()
    );
});


//not %D
test("Test 1: not-instruction to maschine code (not %D)", () => {
    let instruction = new NotInstruction(['%D']);
    // 111 a cccccc ddd jjj
    let expectedCode = "111" + "0" + "001101" + "010" + "000";

    expect(instruction.toMachineCode()).toBe(expectedCode);
});
test("Test 2: create not-instruction from machine code (not %D)", () => {
    let machineCode = "111" + "0" + "001101" + "010" + "000";

    let expectedInstruction = new NotInstruction(['%D']);

    let factory = new InsperHackInstructionFactory();
    let instruction = factory.createFromOpCode([
        {address: 0, value: Word.fromString(machineCode)}
    ], 0);

    expect(instruction).toMatchObject(expectedInstruction);
});
test("Test 3: creating not-instruction from mnemonic (not %D)", () => {
    let factory = new InsperHackInstructionFactory();

    let inst = factory.createFromMnemonic("not", ['%A']);
    let expected = new NotInstruction(['%A']);

    expect(inst).toMatchObject(expected);
});
test("Test 4: negate register D", () => {
    let pcWord = Word.fromSignedIntValue(0);
    let regDWord = Word.fromString("1010101010101010");

    let emulator = {
        registers: {
            'pc': pcWord,
            '%D': regDWord,
        },
    };

    let instruction = new NotInstruction(['%D']);

    instruction.executeOn(emulator);

    expect(regDWord.toSignedIntValue()).toBe(
        Word.fromString("0101010101010101").toSignedIntValue()
    );
});

