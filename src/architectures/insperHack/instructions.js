import { MovInstruction } from "../armlet/instructions";
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
        const code = memory[address].toBitString();

        // is lea ?
        // true then return lea class

        // is jump-instruction ?
        // true then find jump-instruction

        // is nop ? (no dest, no jump -> dest=000, jmp=000)
        
        // is inc or dec

        // c-bits instructions (ALU-code -> a and c bits)


    }
    
    getInstructionClassByOpCode(opCode) {
        // find class c with identical opCode
        return instructionClasses.filter((c) => c.opCode === opCode)[0];
    }
}

export class InsperHackInstruction extends BaseInstruction {
    static extractMemoryBit(code) {
        return code.slice(3, 4);
    }
    static extractOpCode(code) {
        return code.slice(4, 10);
    }
    static extractDestCode(code){
        return code.slice(10, 13);
    }
    static extractJumpCode(code){
        return code.slice(13, 16);
    }

    static extractDestArgs(code) {
        pass
    }

    createDestCode(args) {
        pass
    }

}

export class LeawInstruction extends InsperHackInstruction {

}

export class MovInstruction extends InsperHackInstruction {
    static cCodeToArgs = {
        '0101010': ['$0'],
        '0111111': ['$1'],
        '0111010': ['$-1'],
        '0001100': ['%D'],
        '0110000': ['%A'],
        '1110000': ['(%A)']
    };
    static argsToCcode = {
        '$0': '0101010', //a+c Code
    }
    static matchesCode(code) {
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);

        return (memoryBit + opCode) in this.cCodeToArgs;
    }

    static fromMachineCode(code) {
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);

        let args = this.cCodeToArgs[memoryBit + opCode].concat(this.extractDestArgs(code));

        return new MovInstruction(args);
    }

    toMachineCode() {
        return "111" + argsToCcode[this.args[0]] + this.createDestCode() + "000";
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
    static get mnemonic() {
        return 'notw';
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

export class NotAInstruction extends NotwInstruction {
    static get opCode() {
        return '110001'; // %A
    }
    static fromMachineCode(code) {
        let arg = ['%A'];
        return new NotAInstruction(arg);
    }
}

export class NotDInstruction extends NotwInstruction {
    static get opCode() {
        return '001101'; // %D
    }

    static fromMachineCode(code) {
        let arg = ['%D'];
        return new DecDInstruction(arg);
    }
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
    static matchesCode(code) {
        let destCode = InsperHackInstruction.extractDestCode(code);
        let jumpCode = InsperHackInstruction.extractJumpCode(code);

        return (destCode === "000" && jumpCode === "000");
    }
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

    NotAInstruction,
    NotDInstruction,

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

