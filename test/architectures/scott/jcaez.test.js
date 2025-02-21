import {expect, test} from "vitest";
import {
    JumpIfALargerEqualOrZeroInstruction,
    JumpIfALargerInstruction,
    JumpIfALargerOrEqualInstruction,
    JumpIfALargerOrZeroInstruction,
    JumpIfCarryALargerEqualOrZeroInstruction,
    JumpIfCarryALargerOrEqualInstruction,
    JumpIfCarryALargerOrZeroInstruction,
    JumpIfCarryEqualOrZeroInstruction,
    JumpIfCarryInstruction,
    JumpIfCarryOrALargerInstruction,
    JumpIfCarryOrEqualInstruction,
    JumpIfCarryOrZeroInstruction,
    JumpIfEqualInstruction,
    JumpIfEqualOrZeroInstruction,
    JumpIfZeroInstruction,
    ScottInstructionFactory
} from "@/architectures/scott/instructions.js";
import {Word} from "@/architectures/system.js";
import {ScottEmulator} from "@/architectures/scott/system.js";


const jumpInstructionInstances = [
    new JumpIfCarryInstruction(['123']),
    new JumpIfALargerInstruction(['123']),
    new JumpIfEqualInstruction(['123']),
    new JumpIfZeroInstruction(['123']),

    new JumpIfCarryOrALargerInstruction(['123']),
    new JumpIfCarryOrEqualInstruction(['123']),
    new JumpIfCarryOrZeroInstruction(['123']),
    new JumpIfALargerOrEqualInstruction(['123']),
    new JumpIfALargerOrZeroInstruction(['123']),
    new JumpIfEqualOrZeroInstruction(['123']),

    new JumpIfCarryALargerOrEqualInstruction(['123']),
    new JumpIfCarryALargerOrZeroInstruction(['123']),
    new JumpIfCarryEqualOrZeroInstruction(['123']),
    new JumpIfALargerEqualOrZeroInstruction(['123']),

    new JumpIfCarryALargerEqualOrZeroInstruction(['123']),
];

const jumpInstructionMnemonics = [
    ["JC", ["123"]],
    ["JA", ["123"]],
    ["JE", ["123"]],
    ["JZ", ["123"]],
    ["JCA", ["123"]],
    ["JCE", ["123"]],
    ["JCZ", ["123"]],
    ["JAE", ["123"]],
    ["JAZ", ["123"]],
    ["JEZ", ["123"]],
    ["JCAE", ["123"]],
    ["JCAZ", ["123"]],
    ["JCEZ", ["123"]],
    ["JAEZ", ["123"]],
    ["JCAEZ", ["123"]],
];

const jumpInstructionCodes = [
    ["01011000", "01111011"],
    ["01010100", "01111011"],
    ["01010010", "01111011"],
    ["01010001", "01111011"],
    ["01011100", "01111011"],
    ["01011010", "01111011"],
    ["01011001", "01111011"],
    ["01010110", "01111011"],
    ["01010101", "01111011"],
    ["01010011", "01111011"],
    ["01011110", "01111011"],
    ["01011101", "01111011"],
    ["01011011", "01111011"],
    ["01010111", "01111011"],
    ["01011111", "01111011"],
];

test("test converting conditional jump instructions to machine code", () => {
    jumpInstructionInstances.forEach((inst, idx) => {
        expect(inst.toMachineCode()).toBe(jumpInstructionCodes[idx][0] + jumpInstructionCodes[idx][1]);
    });
})

test("test creating conditional jmp instruction from machine code", () => {
    const factory = new ScottInstructionFactory()

    const generatedInstructions = jumpInstructionCodes.map(code => {
        return factory.createFromOpCode(
            [
                Word.fromString(code[0], 8),
                Word.fromString(code[1], 8)
            ],
            0)
    });

    expect(generatedInstructions).toStrictEqual(jumpInstructionInstances);
})

test("test creating jmp instruction from mnemonic", () => {
    const factory = new ScottInstructionFactory()

    const generatedInstructions = jumpInstructionMnemonics.map(e => {
        const mnemonic = e[0];
        const args = e[1];

        return factory.createFromMnemonic(mnemonic, args);
    });

    expect(generatedInstructions).toStrictEqual(jumpInstructionInstances);
});

test("test conditional jump instructions", () => {
    const mockSystem = new ScottEmulator()

    jumpInstructionInstances.forEach((inst) => {
        mockSystem.registers.flags.set(Word.fromString("0000", 4));
        mockSystem.registers.pc.set(Word.fromSignedIntValue(0, 8));

        inst.executeOn(mockSystem)

        expect(mockSystem.registers.pc.toUnsignedIntValue()).toBe(0);

        const conditionCode = inst.constructor.conditionCode.split("").reverse().join("");
        mockSystem.registers.flags.set(Word.fromString(conditionCode, 4));

        inst.executeOn(mockSystem)

        expect(mockSystem.registers.pc.toUnsignedIntValue()).toBe(123 - 2);
    })
});