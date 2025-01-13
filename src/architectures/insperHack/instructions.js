import { BaseInstruction } from "../instructions";

export class InsperHackInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        let instructionClass = this.getInstructionClassByMnemonic(mnemonic);
        return new instructionClass(args);
    }

    getInstructionClassByMnemonic(mnemonic) {
        return instructionClasses.filter((c) => c.mnemonic === mnemonic)[0];
    }

    createFromOpCode(memory, address) {
        
    }
    
    getInstructionClassByOpCode(opCode) {
        return instructionClasses.filter((c) => c.opCode === opCode)[0];
    }
}

export class AddwInstruction extends BaseInstruction {
    static get mnemonic() {
        return 'addw';
    }
    static get opCode() {
        return '000010';
    }

    static fromMachineCode(code) {
        // TO-DO
    }

    toMachineCode() {
        // TO-DO
    }
}

const instructionClasses = [
    AddwInstruction,
];

