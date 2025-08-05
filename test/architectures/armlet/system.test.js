import {expect, test} from "vitest";
import {ArmletEmulator} from "@/architectures/armlet/system.ts";
import {
    AddInstruction,
    BneImmediateInstruction,
    CmpImmediateInstruction,
    HltInstruction,
    MovImmediateInstruction,
    SubImmediateInstruction
} from "@/architectures/armlet/instructions.ts";

test("test execution of a program", () => {
    let emulator = new ArmletEmulator();
    emulator.interruptHandler['alert'] = (system, msg) => {
        console.log(msg);
    };

    let prog = [
        new MovImmediateInstruction(['$1', '5']),
        new AddInstruction(['$2', '$2', '$1']),
        new SubImmediateInstruction(['$1', '$1', '1']),
        new CmpImmediateInstruction(['$1', '0']),
        new BneImmediateInstruction(['1']),
        new HltInstruction(),
    ];

    emulator.loadProgram(prog);

    while (!emulator.isTerminated) {
        emulator.executeSingleInstruction();
    }

    expect(emulator.registers.$1.toUnsignedIntValue()).toBe(0);
    expect(emulator.registers.$2.toUnsignedIntValue()).toBe(15);
});