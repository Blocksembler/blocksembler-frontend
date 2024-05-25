import {BaseEmulator, ImmutableWord, Word} from "../system";
import {AnnaInstructionFactory} from "./instructions";

const addressSize = 16;

const registers = {
    0: ImmutableWord.fromSignedIntValue(0, addressSize),
    1: Word.fromSignedIntValue(0, addressSize),
    2: Word.fromSignedIntValue(0, addressSize),
    3: Word.fromSignedIntValue(0, addressSize),
    4: Word.fromSignedIntValue(0, addressSize),
    5: Word.fromSignedIntValue(0, addressSize),
    6: Word.fromSignedIntValue(0, addressSize),
    7: Word.fromSignedIntValue(0, addressSize),
};

const annaInterrupts = {
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

export class AnnaEmulator extends BaseEmulator {
    constructor() {
        super(registers, addressSize, new AnnaInstructionFactory(), annaInterrupts);
    }
}
