import {BaseEmulator, Word} from "@/architectures/emulator";
import {BaseInstruction, PseudoInstruction} from "@/architectures/instructions";


export interface InstructionFactory {
    createFromMnemonic(mnemonic: string, args: Array<string>): Instruction;

    createFromOpCode(memory: Array<MemoryLocation>, address: number): Instruction;
}

export type InterruptFunction = (emulator: BaseEmulator, ...params: Array<string>) => string | void;

export type MemoryLocation = {
    address: number;
    value: Word;
}

export type Instruction = BaseInstruction | PseudoInstruction;