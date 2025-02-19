import {BaseEmulator, Word} from "../system";
import {ScottInstructionFactory} from "@/architectures/scott/instructions.js";

export const addressSize = 8;

const registers = {
    r0: Word.fromSignedIntValue(0, addressSize),
    r1: Word.fromSignedIntValue(0, addressSize),
    r2: Word.fromSignedIntValue(0, addressSize),
    r3: Word.fromSignedIntValue(0, addressSize),
}

export class ScottEmulator extends BaseEmulator {
    constructor() {
        super(registers, addressSize, new ScottInstructionFactory(), {}, true);
    }
}
