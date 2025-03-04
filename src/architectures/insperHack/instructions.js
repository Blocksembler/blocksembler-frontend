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

    get op1() {
        return this.args[0];
    }
    get op2() {
        return this.args[1];
    }
    get dest() {
        return this.args.slice(2);
    }

    // extract bit (a) which defines the instruction type
    static extractA(code) {
        let a = code.slice(2, 4)[0];
        return a;
    }

    // extract destination bits d1, d2, d3
    static extractD(code) {
        return code.slice(10, 13);
    }

    // extract jump bits jq, j2,j3
    static extractJ(code) {
        let j = code.slice(13, 17)[0];
        return j;
    }

    // create destination array args from bits (d1, d2, d3) in code
    static setDestinations(code) {
        let args = [];
        if (this.extractD(code)[0] == '1') { // d1
            args.push('%A');
        }
        if (this.extractD(code)[1] == '1') { // d2
            args.push('%D');
        } 
        if (this.extractD(code)[2] == '1') { // d3
            args.push('(%A)');
        }
        return args;
    }

    // create param array params from code (decision by bit a) in code
    static setParams(code) {
        let params = [];
        if (this.extractA(code) == '1') {
            params.push('(%A)', '%D');
        }
        else {
            params.push('%A', '%D');
        }
        return params;
    }

    // append 000 for no jump operations
    noJump(code) {
        code += "000";
        return code;
    }

    createCodeFromArgs(args, code) {
        if (args.slice(2).includes('%A')) { // %A
            code += '1';
        } else {
            code += '0';
        }
        if (args.slice(2).includes('%D')) { // %D
            code += '1';
        } else {
            code += '0';
        }
        if (args.slice(2).includes('(%A)')) { // (%A)
            code += '1';
        } else {
            code += '0';
        }   
        return code;     
    }

    startInstructionTypeC(args) {
        let code = '111';
        if (args[0].startsWith('(') || args[1].startsWith('(')) {
            code += '1';
        } else {
            code += '0';
        }
        return code;
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
        let params = this.setParams(code);
        let dest = this.setDestinations(code);
        let args = params.concat(dest);

        return new AddwInstruction(args);
    }

    executeOn(system) {
        let op1Word;
        if (this.op1.startsWith('(')) {
            // get value of Memory
            let address = system.registers['%A'].toUnsignedIntValue();
            // set value
            op1Word = system.memory[address];
        } else {
            op1Word = system.registers[this.op1];
        }
        let op2Word;
        if (this.op2.startsWith('(')) { // memory
            // get value of Memory
            let address = system.registers['%A'].toUnsignedIntValue();
            // set value
            op2Word = system.memory[address];
        } else if (this.op2.startsWith('%'))  { // register
            op2Word = system.registers[this.op2];
        } else { // immediate
            op2Word = Word.fromSignedIntValue(Number(this.op2));
        }

        this.dest.forEach((dest) => { 
            let destWord;
            if (dest.startsWith('(')) { // memory
                let address = system.register['%A'].toUnsignedIntValue();
                destWord = system.memory[address];
            } else {
                destWord = system.registers[dest]; // register
            }
            // set result word
            destWord.set(op1Word.add(op2Word));
        });
    }

    toMachineCode() {
        let code = this.startInstructionTypeC(this.args);
        // get opCode and append
        let prototype = Object.getPrototypeOf(this);
        code += prototype.constructor.opCode;
        // append params and destinations
        code = this.noJump(this.createCodeFromArgs(this.args, code));

        return code;

    }
}

// A-D and M-D
// TO-DO: D-A and D-M with opcode 010011
export class SubwInstruction extends InsperHackInstruction {
    static get mnemonic() {
        return 'subw';
    }
    static get opCode() {
        return '000111'; // A-D and M-D
    }

    // generates assembly-text array args from code
    static fromMachineCode(code) {
        let params = this.setParams(code);
        let dest = this.setDestinations(code);
        let args = params.concat(dest);

        return new SubwInstruction(args);
    }

    executeOn(system) {
        let op1Word;
        if (this.op1.startsWith('(')) {
            // get value of Memory
            let address = system.registers['%A'].toUnsignedIntValue();
            // set value
            op1Word = system.memory[address];
        } else {
            op1Word = system.registers[this.op1];
        }
        let op2Word;
        if (this.op2.startsWith('(')) { // memory
            // get value of Memory
            let address = system.registers['%A'].toUnsignedIntValue();
            // set value
            op2Word = system.memory[address];
        } else if (this.op2.startsWith('%'))  { // register
            op2Word = system.registers[this.op2];
        } else { // immediate
            op2Word = Word.fromSignedIntValue(Number(this.op2));
        }

        this.dest.forEach((dest) => { 
            let destWord;
            if (dest.startsWith('(')) { // memory
                let address = system.register['%A'].toUnsignedIntValue();
                destWord = system.memory[address];
            } else {
                destWord = system.registers[dest]; // register
            }
            // set result word
            destWord.set(op1Word.subtract(op2Word));
        });
    }

    toMachineCode() {
        // setup instruction code
        let code = this.startInstructionTypeC(this.args);
        // get opCode and append
        let prototype = Object.getPrototypeOf(this);
        code += prototype.constructor.opCode;
        // append params and destinations
        code = this.noJump(this.createCodeFromArgs(this.args, code));

        return code;
    }
}

const instructionClasses = [
    AddwInstruction,
    SubwInstruction,
];

