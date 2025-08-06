import {Word} from "@/architectures/emulator";
import {ArmletEmulator} from "@/architectures/armlet/system";
import {AbstractImmediateArmletInstruction} from "@/architectures/armlet/instructions";
import {BaseInstruction} from "@/architectures/instructions";

export const generateMockSystem = (registers: [number, number, number, number, number, number, number, number, number],
                                   instruction?: BaseInstruction): ArmletEmulator => {
    let registerWords = registers.map((regVal) => Word.fromSignedIntValue(regVal))

    let mockSystem = new ArmletEmulator()
    mockSystem.registers['pc'] = registerWords[0]
    mockSystem.registers['$0'] = registerWords[1]
    mockSystem.registers['$1'] = registerWords[2]
    mockSystem.registers['$2'] = registerWords[3]
    mockSystem.registers['$3'] = registerWords[4]
    mockSystem.registers['$4'] = registerWords[5]
    mockSystem.registers['$5'] = registerWords[6]
    mockSystem.registers['$6'] = registerWords[7]
    mockSystem.registers['$7'] = registerWords[8]

    if (instruction) {
        mockSystem.memory[0].address = 0;
        mockSystem.memory[0].value = Word.fromString(instruction.toMachineCode().slice(0, 16));

    }
    if (instruction instanceof AbstractImmediateArmletInstruction) {
        mockSystem.memory[1].address = 1;
        mockSystem.memory[1].value = Word.fromString(instruction.toMachineCode().slice(16, 32));
    }

    return mockSystem
}