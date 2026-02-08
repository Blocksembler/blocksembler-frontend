import {BaseEmulator, ImmutableWord, Word} from "@/architectures/emulator";
import {AnnaInstructionFactory} from "./instructions";
import {InterruptFunction} from "@/types/emulator";
import {isDecimal, isHex} from "@/util/number";

export const addressSize = 16;

export class AnnaEmulator extends BaseEmulator {
    constructor() {
        const registers = AnnaEmulator.setUpRegisters();
        const interrupts: Record<string, InterruptFunction> = AnnaEmulator.setUpInterrupts();

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

    static setUpInterrupts(): Record<string, InterruptFunction> {
        return {
            "alert": (_emulator: BaseEmulator, value): string => {
                alert(value);
                return "";
            },
            "input": (_emulator: BaseEmulator): string => {
                let userInput = prompt("Enter a value");
                if (userInput === null) {
                    return "0";
                }

                if (isHex(userInput)) {
                    userInput = parseInt(userInput, 16).toString();
                } else if (!isDecimal(userInput)) {
                    userInput = "0";
                }

                return userInput;
            },
            "output": (emulator: BaseEmulator, value: string): string => {
                emulator.print(value);
                return "";
            },
            "halt": (emulator: BaseEmulator): string => {
                emulator.output.push("The program terminated");
                emulator.halt();
                return "";
            },
        };
    }
}
