import {BaseEmulator, Word} from "@/architectures/emulator";
import {BaseInstruction} from "@/architectures/instructions";


export interface InstructionFactory {
    createFromMnemonic(mnemonic: string, args: Array<string>): BaseInstruction;

    createFromOpCode(memory: Array<MemoryLocation>, address: number): BaseInstruction;
}

export type InterruptFunction = (emulator: BaseEmulator, ...params: Array<string>) => string | null;

export type MemoryLocation = {
    address: number;
    value: Word;
}

export type Instruction = BaseInstruction;