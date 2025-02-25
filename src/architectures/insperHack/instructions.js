import { BaseInstruction } from "../instructions";
import {Word} from "../system";

export class InsperHackInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        let instructionClass = this.getInstructionClassByMnemonic(mnemonic);
        return new instructionClass(args);
    }

    getInstructionClassByMnemonic(mnemonic) {
        return instructionClasses.filter((c) => c.mnemonic === mnemonic)[0];
    }

    createFromOpCode(memory, address) {
        // get Opcode
        let code = memory[address].toBitString()
        let opCode = code.slice(4, 10);
        let instructionClass = this.getInstructionClassByOpCode(opCode);

        return instructionClass.fromMachineCode(code);
    }
    
    getInstructionClassByOpCode(opCode) {
        // find class c with identical opCode
        return instructionClasses.filter((c) => c.opCode === opCode)[0];
    }
}

export class InsperHackInstruction extends BaseInstruction {

    get pcWord() {
        return this.args[0];
    }

    get rs1() {
        return this.args[1];
    }

    get rs2() {
        return this.args[2];
    }

    // extract destination bits d1, d2, d3
    static extractD123(code) {
        return code.slice(10, 13);
    }

    // create destination array args from bits (d1, d2, d3) in code
    static findDestinationsFrom(code) {
        let args = [];
        if (this.extractD123(code)[0] == '1') { // d1
            args.push('%A');
        }
        if (this.extractD123(code)[1] == '1') { // d2
            args.push('%D');
        } 
        if (this.extractD123(code)[2] == '1') { // d3
            args.push('(%A)');
        }
    
        return args;
    }

    // extract bit (a) which defines the instruction type
    static extractA(code) {
        let a = code.slice(2, 4)[0];
        return a;
    }
}

export class AddwInstruction extends InsperHackInstruction {
    static get mnemonic() {
        return 'addw';
    }
    static get opCode() {
        return '000010';
    }

    // generates assembly-text array args from code
    static fromMachineCode(code) {
        // set params
        let params = [];
        if (this.extractA(code) == '1') {
            params.push('(%A)', '%D');
        }
        else {
            params.push('%A', '%D');
        }
        // set destinations
        let dest = this.findDestinationsFrom(code);
        let args = params.concat(dest);
        
        //console.log(args);
        return new AddwInstruction(args);
    }

    executeOn(system) {
        let target = system.registers[this.pcWord];
        let firstOperand = system.registers[this.rs1].toSignedIntValue();
        let secondOperand = system.registers[this.rs2].toSignedIntValue();
        console.log(firstOperand);
        console.log(secondOperand);
        let result = firstOperand + secondOperand;
        target.set(result);
    }

    toMachineCode() {
        let code = '111';
        if (this.args[0].startsWith('(') || this.args[1].startsWith('(')) {
            code += '1';
        } else {
            code += '0';
        }
        // get opCode and append
        let prototype = Object.getPrototypeOf(this);
        code += prototype.constructor.opCode;

        // params and destinations
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

