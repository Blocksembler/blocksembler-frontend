import {BaseEmulator, Word} from "../emulator.ts";
import {ScottInstructionFactory} from "@/architectures/scott/instructions.js";

export const addressSize = 8;

const registers = {
    flags: Word.fromSignedIntValue(0, 4),
    R0: Word.fromSignedIntValue(0, addressSize),
    R1: Word.fromSignedIntValue(0, addressSize),
    R2: Word.fromSignedIntValue(0, addressSize),
    R3: Word.fromSignedIntValue(0, addressSize),
}

export class ScottEmulator extends BaseEmulator {
    constructor() {
        super(registers, addressSize, new ScottInstructionFactory(), {}, false);
    }
}
