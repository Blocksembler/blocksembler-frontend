import {BaseEmulator, Word} from "@/architectures/emulator";


export interface InstructionFactory {
    createFromMnemonic(mnemonic: string, args: Array<string>): Instruction;

    createFromOpCode(memory: Array<MemoryLocation>, address: number): Instruction;
}

export type InterruptFunction = (emulator: BaseEmulator, ...params: Array<string>) => string | void;

export type MemoryLocation = {
    address: number;
    value: Word;
}

export interface Instruction {
    executeOn(e: BaseEmulator): void;

    toMachineCode(): string;

    toString(): string;
}