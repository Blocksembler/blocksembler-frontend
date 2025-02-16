import {BaseEmulator, ImmutableWord, Word} from "../system";
import {AnnaInstructionFactory} from "./instructions";

const addressSize = 16;

export class AnnaEmulator extends BaseEmulator {
    constructor() {
        const registers = AnnaEmulator.setUpRegisters();
        const interrupts = AnnaEmulator.setUpInterrupts();
        super(registers, addressSize, new AnnaInstructionFactory(), interrupts);
    }

    static setUpRegisters() {
        return {
            r0: ImmutableWord.fromSignedIntValue(0, addressSize),
            r1: Word.fromSignedIntValue(0, addressSize),
            r2: Word.fromSignedIntValue(0, addressSize),
            r3: Word.fromSignedIntValue(0, addressSize),
            r4: Word.fromSignedIntValue(0, addressSize),
            r5: Word.fromSignedIntValue(0, addressSize),
            r6: Word.fromSignedIntValue(0, addressSize),
            r7: Word.fromSignedIntValue(0, addressSize),
        };
    }

    static setUpInterrupts() {
        return {
            input: (_emulator, _register) => {
                return parseInt(prompt("Enter a value"));
            },
            output: (emulator, value) => {
                emulator.print(value);
            },
            halt: (emulator, _register) => {
                alert("The program terminated");
                emulator.halt();
            },
        };
    }
}
