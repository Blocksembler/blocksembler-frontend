import {BaseEmulator, Word} from "../system";
import {ArmletInstructionFactory} from "@/architectures/armlet/instructions.js";

export const addressSize = 16;

export class ArmletEmulator extends BaseEmulator {
    constructor() {
        const registers = ArmletEmulator.setUpRegistersStatic();
        const interrupts = ArmletEmulator.setUpInterruptsStatic();
        super(registers, addressSize, new ArmletInstructionFactory(), interrupts);
    }

    get isEqFlagSet() {
        return this.registers.status.bits[0] === 1
    }

    get isGtFlagSet() {
        return this.registers.status.bits[1] === 1
    }

    get isAbFlagSet() {
        return this.registers.status.bits[2] === 1
    }

    static setUpRegistersStatic() {
        return {
            'status': Word.fromSignedIntValue(0, 3),
            '$0': Word.fromSignedIntValue(0, addressSize),
            '$1': Word.fromSignedIntValue(0, addressSize),
            '$2': Word.fromSignedIntValue(0, addressSize),
            '$3': Word.fromSignedIntValue(0, addressSize),
            '$4': Word.fromSignedIntValue(0, addressSize),
            '$5': Word.fromSignedIntValue(0, addressSize),
            '$6': Word.fromSignedIntValue(0, addressSize),
            '$7': Word.fromSignedIntValue(0, addressSize),
        }
    }

    static setUpInterruptsStatic() {
        return {
            'trp': (system) => {
                system.pauseExecution()
            },
            'hlt': (system) => {
                system.callInterrupt('alert', 'The program terminated');
                system.halt();
            },
            'alert': (system, msg) => {
                alert(msg);
            }
        }
    }
}
