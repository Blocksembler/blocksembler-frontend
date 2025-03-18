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

    // extract opCode bits (c)
    static extractC(code) {
        let c = code.slice(4, 10)[0];
        return c;
    }

    // extract destination bits d1, d2, d3
    static extractD(code) {
        return code.slice(10, 13);
    }

    // extract jump bits j1, j2, j3
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
        // Instruction with only one param
        if (args.length == 1) {
            if (args[0].includes('(%A)') || args[0].includes('(%D)')) { // Memory Access
                console.log("Error: Cannot read and write at the same time.");
            }
            else if (args[0].includes('%A')) { // %A  set destination
                code += '100';
            }
            else if (args[0].includes('%D')) { // %D set destination
                code += '010';
            }
            else {
                console.log("Error: Type in param correctly.");
            }
        }
        // Instruction with two params
        else {
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
        }
        // Instruction without param
        // TO-DO
        return code; 
    }

    startInstructionTypeC(args) {
        let code = '111';
        // Instruction with only one param
        if (args.length == 1) {
            code += 0; // for incw
        }
        // Instruction with two params
        else {
            if (args[0].startsWith('(') || args[1].startsWith('(')) {
                code += '1';
            } else {
                code += '0';
            }
        }
        // Instruction without param
        // TO-DO
        return code;
    }

    getRegValue(system, operand) {
        return system.registers[operand];
    }

    getMemoryValue(system) {
        // get value of Memory
        let address = system.registers['%A'].toUnsignedIntValue();
        // set value
        return system.memory[address];
    }

    getImmediateValue(operand) {
        return Word.fromSignedIntValue(Number(operand));
    }

    isMemoryAccess(param) {
        return param.startsWith('(');
    }
}

export class LeawInstruction extends InsperHackInstruction {

}

export class MovwInstruction extends InsperHackInstruction {

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
        // operand 1 reg/mem
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            op1Word = this.getMemoryValue(system);
        } else {
            op1Word = this.getRegValue(system, this.op1);
        };
        // operand 2 (op2) reg/mem/im
        let op2Word;
        if (this.isMemoryAccess(this.op2)) {
            op2Word = this.getMemoryValue(system);
        } else if (this.op2.startsWith('%'))  { 
            op2Word = this.getRegValue(system, this.op2);
        } else { 
            op2Word = this.getImmediateValue(this.op2);
        }

        this.dest.forEach((dest) => { 
            // destinations one of mem/reg
            let destWord;
            if (this.isMemoryAccess(dest)) {
                destWord = this.getMemoryValue(system);
            } else {
                destWord = this.getRegValue(system, dest);
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
        // operand 1 reg/mem
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            op1Word = this.getMemoryValue(system);
        } else {
            op1Word = this.getRegValue(system, this.op1);
        };
        // operand 2 (op2) reg/mem/im
        let op2Word;
        if (this.isMemoryAccess(this.op2)) {
            op2Word = this.getMemoryValue(system);
        } else if (this.op2.startsWith('%'))  { 
            op2Word = this.getRegValue(system, this.op2);
        } else { 
            op2Word = this.getImmediateValue(this.op2);
        }

        this.dest.forEach((dest) => { 
            let destWord;
            if (this.isMemoryAccess(dest)) {
                destWord = this.getRegValue(system, dest);
            } else {
                destWord = this.getRegValue(system, dest);
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

export class RsubwInstruction extends InsperHackInstruction {

}

class OverwriteInstruction extends InsperHackInstruction {
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

class IncwInstruction extends OverwriteInstruction {
    static get mnemonic() {
        return 'incw';
    }
    executeOn(system) {
        // operand 1 reg
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            console.log("Error: Cannot read and write at the same time.");
        } else {
            op1Word = this.getRegValue(system, this.op1);
            let destWord = op1Word; // same destination as given register
            //destWord.set(op1Word.addImmediate(1));
            destWord.set(op1Word.inc());
            return destWord;
        }
    }    
}

export class IncAInstruction extends IncwInstruction {
    static get opCode() {
        return '110111'; // %A
    }
    static fromMachineCode(code) {
        let arg = ['%A'];
        return new IncAInstruction(arg);
    }
}

export class IncDInstruction extends IncwInstruction {
    static get opCode() {
        return '011111'; // %D
    }

    static fromMachineCode(code) {
        let arg = ['%D'];
        return new IncDInstruction(arg);
    }
}

class DecwInstruction extends OverwriteInstruction {
    static get mnemonic() {
        return 'decw';
    }
    executeOn(system) {
        // operand 1 reg
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            console.log("Error: Cannot read and write at the same time.");
            //throw new Error('Cannot read and write at the same time.');
        } else {
            op1Word = this.getRegValue(system, this.op1);
            let destWord = op1Word; // same destination as given register
            destWord.set(op1Word.dec());
            return destWord;
        }
    }    
}

export class DecAInstruction extends DecwInstruction {
    static get opCode() {
        return '110010'; // %A
    }
    static fromMachineCode(code) {
        let arg = ['%A'];
        return new DecAInstruction(arg);
    }
}

export class DecDInstruction extends DecwInstruction {
    static get opCode() {
        return '001110'; // %D
    }

    static fromMachineCode(code) {
        let arg = ['%D'];
        return new DecDInstruction(arg);
    }
}

export class NotwInstruction extends InsperHackInstruction {

}

export class NegwInstruction extends InsperHackInstruction {

}

export class AndwInstruction extends InsperHackInstruction {

}

export class OrwInstruction extends InsperHackInstruction {

}

export class JmpInstruction extends InsperHackInstruction {

}

export class JeInstruction extends InsperHackInstruction {

}
export class JneInstruction extends InsperHackInstruction {

}

export class JlInstruction extends InsperHackInstruction {

}

export class JleInstruction extends InsperHackInstruction {

}

export class JgInstruction extends InsperHackInstruction {

}

export class JgeInstruction extends InsperHackInstruction {

}

export class NopInstruction extends InsperHackInstruction {

}

export class LabelInstruction extends InsperHackInstruction {

}

const instructionClasses = [
    LeawInstruction,
    MovwInstruction,


    AddwInstruction,
    SubwInstruction,
    RsubwInstruction,

    IncAInstruction,
    IncDInstruction,
    DecAInstruction,
    DecDInstruction,

    NotwInstruction,
    NegwInstruction,
    AndwInstruction,
    OrwInstruction,

    JmpInstruction,
    JeInstruction,
    JneInstruction,

    JlInstruction,
    JleInstruction,

    JgInstruction,
    JgeInstruction,

    NopInstruction,
    LabelInstruction
];

