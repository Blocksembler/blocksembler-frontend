import {BaseEmulator, ImmutableWord, Word} from "../system";
import {InsperHackInstructionFactory} from "./instructions";

const addressSize = 16;

const registers = {
    '%A': Word.fromSignedIntValue(0, addressSize),
    '%D': Word.fromSignedIntValue(0, addressSize),
}

export class InsperHackEmulator extends BaseEmulator {
    constructor() {
        super(registers, addressSize, new InsperHackInstructionFactory(), {});
    }
}