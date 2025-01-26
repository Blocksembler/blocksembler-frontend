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
        let code = '111';
        if (this.args[0].startsWith('(') || this.args[1].startsWith('(')) {
            code += '1';
        } else {
            code += '0';
        }
        //get opCode and append
        let prototype = Object.getPrototypeOf(this);
        code += prototype.constructor.opCode;

        // destinations
        // %A %D (%A) 
        if (this.args.slice(2).includes('%A')) { // %A
            code += '1';
        } else {
            code += '0';
        }
        if (this.args.slice(2).includes('%D')) { // %D
            code += '1';
        } else {
            code += '0';
        }
        if (this.args.slice(2).includes('(%A)')) { // (%A)
            code += '1';
        } else {
            code += '0';
        }

        // no jump
        code += '000';

        return code;
    }
}

const instructionClasses = [
    AddwInstruction,
];

