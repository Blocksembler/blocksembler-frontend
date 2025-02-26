import {BaseEmulator, Word} from "@/architectures/system.js";
import {SimpleRISCInstructionFactory} from "@/architectures/simpleRISC/instructions.js";

const factory = new SimpleRISCInstructionFactory();

const simpleRISCInterrupts = {
    'hlt': (system) => {
        system.callInterrupt('alert', 'The program terminated');
        system.halt();
    },
    'alert': (system, msg) => {
        alert(msg);
    }
}

export class SimpleRISCEmulator extends BaseEmulator {
    constructor(interrupts = simpleRISCInterrupts) {
        const registers = {
            "STATUS_EQ": Word.fromSignedIntValue(0, 1),
            "STATUS_GT": Word.fromSignedIntValue(0, 1),
            "$ACC": Word.fromSignedIntValue(0),
        }

        for (let i = 0; i < 16; i++) {
            registers[`$${i}`] = Word.fromSignedIntValue(0);
        }

        super(registers, 16, factory, interrupts, false);
    }
}