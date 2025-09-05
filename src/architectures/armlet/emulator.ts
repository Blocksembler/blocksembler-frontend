import {BaseEmulator, Word} from "../emulator";
import {ArmletInstructionFactory} from "@/architectures/armlet/instructions";
import {InterruptFunction} from "@/types/emulator";

export const addressSize = 16;

export class ArmletEmulator extends BaseEmulator {
    constructor() {
        const registers = ArmletEmulator.setUpRegistersStatic();
        const interrupts: Record<string, InterruptFunction> = ArmletEmulator.setUpInterruptsStatic();
        super(registers, addressSize, new ArmletInstructionFactory(), interrupts, false);
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

    static setUpInterruptsStatic(): Record<string, InterruptFunction> {
        return {
            trp: (emulator: BaseEmulator): string | null => {
                emulator.pauseExecution()
                return null;
            },
            hlt: (e: BaseEmulator): string | null => {
                e.callInterrupt('alert', 'The program terminated');
                e.halt();

                return null;
            },
            alert: (_e: BaseEmulator, msg: string): string | null => {
                alert(msg);
                return null;
            }
        }
    }

    executeSingleInstruction() {
        let nextInstruction = this.loadInstructionAt(this.registers.pc.toUnsignedIntValue());
        let instructionLength = Math.floor(nextInstruction.toMachineCode().length / this.addressSize);

        nextInstruction.executeOn(this);

        this.registers.pc.set(this.registers.pc.addImmediate(instructionLength));
    }
}
