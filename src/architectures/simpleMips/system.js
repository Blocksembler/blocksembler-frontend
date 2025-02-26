import {BaseEmulator, Word} from "@/architectures/system.js";
import {SimpleMipsInstructionFactory} from "@/architectures/simpleMips/instructions.js";

const factory = new SimpleMipsInstructionFactory();

const registers = {
    "ACC": Word.fromSignedIntValue(0),
}

for (let i = 0; i < 16; i++) {
    registers[`R${i}`] = Word.fromSignedIntValue(0);
}


export class SimpleMipsEmulator extends BaseEmulator {
    constructor() {
        super(registers, 16, factory, SimpleMipsEmulator.setUpInterruptsStatic(), false);
    }

    static setUpInterruptsStatic() {
        return {
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