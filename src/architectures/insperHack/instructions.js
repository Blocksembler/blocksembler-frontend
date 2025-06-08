import { MovInstruction } from "../insperHack/instructions";
import { BaseInstruction } from "../instructions";
import {Word} from "../system";

export class InsperHackInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        let instructionClass = this.getInstructionClassByMnemonic(mnemonic);
        return new instructionClass(args);
    }

    getInstructionClassByMnemonic(mnemonic) {
        return mnemonicToClass[mnemonic];
    }

    createFromOpCode(memory, address) {
        const code = memory[address].toBitString();

        let aluCode = code.slice(3,10);

        // is lea ?
        // true then return lea class

        // is jump-instruction ?
        // true then find jump-instruction

        // is nop ? (no dest, no jump -> dest=000, jmp=000)
        
        // is inc or dec
        switch (aluCode) {
            case '0011111': // %D+1
              return IncInstruction.fromMachineCode(code);
            case '0110111': // %A+1
                return IncInstruction.fromMachineCode(code);
            case '0001110': // %D-1
              return DecInstruction.fromMachineCode(code);
            case '0110010': // %A-1
                return DecInstruction.fromMachineCode(code);
            default:
              break;
          }

        // c-bits instructions (ALU-code -> a and c bits)        
        switch (aluCode) {
            case '0001101': // !%D
                return NotInstruction.fromMachineCode(code);
            case '0110001': // !%A
                return NotInstruction.fromMachineCode(code);
            case '1110011': // !%(A)
                // throw error -> not read and write at the same time
                break;
            case '0001111': // -%D
                return NegInstruction.fromMachineCode(code);
            case '0110011': // -%A
                return NegInstruction.fromMachineCode(code);
            case '0110000':
              return MovInstruction.fromMachineCode(code);
            case '1110000':
                return MovInstruction.fromMachineCode(code);
            case '0000010': // D+A
                return AddInstruction.fromMachineCode(code);
            case '1000010': // D+M
                return AddInstruction.fromMachineCode(code);
            // …
            default:
              break;
          }
    
    }
    
    getInstructionClassByOpCode(opCode) {
        // find class c with identical opCode
        return mnemonicToClass.filter((c) => c.opCode === opCode)[0];
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

    // append 000 for no jump operations
    noJump(code) {
        code += "000";
        return code;
    }
    getRegValue(system, operand) {
        return system.registers[operand];
    }

    getMemoryAddress(system) {
        // get value of Memory
        let address = system.registers['%A'].toUnsignedIntValue();
        // set value
        return system.memory[address];
    }

    getImmediateValue(operand) {
        //turns immediate into a number - then a Word
        let imm = parseInt(operand.slice(1));
        return Word.fromSignedIntValue(imm);
    }

    isMemoryAccess(param) {
        return param.startsWith('(');
    }
}

export class OverwriteInstruction extends InsperHackInstruction {
    matchesCode(code) {
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);

        return (memoryBit + opCode) in this.cCodeToArgs, cCode;
    }
}

export class IncInstruction extends OverwriteInstruction {
    static cCodeToArgs = {
        '0011111': ['%D'],
        '0110111': ['%A']
    };
    argsToCcode = {
        '%D': '0011111', //a+c Code
        '%A': '0110111'
    };
    argToDest = {
        '%D': '010', // d Code
        '%A': '100'
    }
    static fromMachineCode(code) { 
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];
        let args = params;

        return new IncInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append param and destination
        code += this.noJump(this.argToDest[this.args[0]]);
        return code;
    }

    executeOn(system) {
        // operand 1 reg
        let op1Word = this.getRegValue(system, this.op1);

        // overwirte reg with increment of op1Word
        // set result word
        op1Word.set(op1Word.inc());
    }
}

export class DecInstruction extends OverwriteInstruction {
    static cCodeToArgs = {
        '0001110': ['%D'],
        '0110010': ['%A']
    };
    argsToCcode = {
        '%D': '0001110', //a+c Code
        '%A': '0110010'
    };
    argToDest = {
        '%D': '010', // d Code
        '%A': '100'
    }
    static fromMachineCode(code) { 
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];
        let args = params;

        return new DecInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append param and destination
        code += this.noJump(this.argToDest[this.args[0]]);
        return code;
    }

    executeOn(system) {
        // operand 1 reg
        let op1Word = this.getRegValue(system, this.op1);

        // overwrite reg with decrement of op1Word
        // set result word
        op1Word.set(op1Word.dec());
    }
}

export class NotInstruction extends OverwriteInstruction {
    static cCodeToArgs = {
        '0001101': ['%D'],
        '0110001': ['%A'],
    };
    argsToCcode = {
        '%D': '0001101', //a+c Code
        '%A': '0110001',
    };
    static cCodeToDests = {
        '100': ['%A'],
        '010': ['%D'],
    };
    createDestCodeFrom(args) {
        let destCode = [0, 0, 0];
        if (args === '%A') {
            destCode[0] = 1;
        }
        if (args === '%D') {
            destCode[1] = 1;
        }
        return destCode.join('');
    }
    static fromMachineCode(code) { 
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];

        let args = params;

        return new NotInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append params and destinations
        code += this.noJump(this.createDestCodeFrom(this.args[0]));
        return code;
    }

    executeOn(system) {
        // operand 1 reg
        let op1Word = this.getRegValue(system, this.op1);

        // overwirte each register with its negation
        let destWord = this.getRegValue(system, this.args[0]);
        // set result word
        destWord.set(op1Word.invert());
    }
}

export class NegInstruction extends OverwriteInstruction {
    static cCodeToArgs = {
        '0001111': ['%D'],
        '0110011': ['%A'],
    };
    argsToCcode = {
        '%D': '0001111', //a+c Code
        '%A': '0110011',
    };
    static cCodeToDests = {
        '100': ['%A'],
        '010': ['%D'],
    };
    createDestCodeFrom(args) {
        let destCode = [0, 0, 0];
        if (args === '%A') {
            destCode[0] = 1;
        }
        if (args === '%D') {
            destCode[1] = 1;
        }
        return destCode.join('');
    }
    static fromMachineCode(code) { 
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];

        let args = params;

        return new NegInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append params and destinations
        code += this.noJump(this.createDestCodeFrom(this.args[0]));
        return code;
    }

    executeOn(system) {
        // operand 1 reg
        let op1Word = this.getRegValue(system, this.op1);

        // overwrite each register with its negation
        let destWord = this.getRegValue(system, this.args[0]);
        // set result word
        destWord.set(op1Word.invert().addImmediate(1));
    }
}



const mnemonicToClass = {
    'inc': IncInstruction,
    'dec': DecInstruction
    'not': NotInstruction,
    'neg': NegInstruction,
};

