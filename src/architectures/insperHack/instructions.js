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

        // is lea ?
        // true then return lea class

        // is jump-instruction ?
        // true then find jump-instruction

        // is nop ? (no dest, no jump -> dest=000, jmp=000)
        
        // is inc or dec

        // c-bits instructions (ALU-code -> a and c bits)
        let aluCode = code.slice(3,10);
        
        switch (aluCode) {
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

export class MovInstruction extends InsperHackInstruction {
    static cCodeToArgs = {
        '0101010': ['$0'],
        '0111111': ['$1'],
        '0111010': ['$-1'],
        '0001100': ['%D'],
        '0110000': ['%A'],
        '1110000': ['(%A)']
    };
    argsToCcode = {
        '$0': '0101010', //a+c Code
        '$1': '0111111',
        '$-1': '0111010',
        '%D': '0001100',
        '%A': '0110000',
        '(%A)':'1110000'
    };
    static cCodeToDests = {
        '000': [''],
        '100': ['%A'],
        '010': ['%D'],
        '001': ['(%A)'],
        '110': ['%A', '%D'],
        '101': ['%A', '(%A)'],
        '011': ['%D', '(%A)'],
        '111': ['%A', '%D', '(%A)'],
    };
    createDestCodeFrom(args) {
        let destCode = [0, 0, 0];
        args = args.slice(1);
        args.forEach(arg => {
            if (arg === '%A') {
                destCode[0] = 1;
            }
            if (arg === '%D') {
                destCode[1] = 1;
            }
            if (arg === '(%A)') {
                destCode[2] = 1;
            }
        });
        return destCode.join('');
    }
    static matchesCode(code) {
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);

        return (memoryBit + opCode) in this.cCodeToArgs;
    }
    static fromMachineCode(code) { // IN-PROGRESS
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];

        let dests = this.cCodeToDests[this.extractDestCode(code)];
        let args = params.concat(dests);

        return new MovInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append params and destinations
        code += this.noJump(this.createDestCodeFrom(this.args));

        return code;
    }

    executeOn(system) {
        // operand 1 reg/mem/im
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            op1Word = this.getMemoryAddress(system);
        } else if (this.op1.startsWith('%'))  { 
            op1Word = this.getRegValue(system, this.op1);
        } else { 
            op1Word = this.getImmediateValue(this.op1);
        }
        // operand 2 reg/mem
        let op2Word;
        if (this.isMemoryAccess(this.op2)) {
            op2Word = this.getMemoryAddress(system);
        } else {
            op2Word = this.getRegValue(system, this.op2);
        };

        // add second operand to destinations
        let dest = this.args.slice(1);   

        // overwirte each destination with op1Word
        dest.forEach((dest) => { 
            let destWord = this.getRegValue(system, dest);
            // set result word
            destWord.set(op1Word);
        });
    }
}

export class NopInstruction extends InsperHackInstruction {
    static matchesCode(code) {
        let destCode = InsperHackInstruction.extractDestCode(code);
        let jumpCode = InsperHackInstruction.extractJumpCode(code);

        return (destCode === "000" && jumpCode === "000");
    }
}

export class AddInstruction extends InsperHackInstruction {
    static cCodeToArgs = {
        '0101010': ['$0'],
        '0111111': ['$1'],
        '0111010': ['$-1'],
        '0000010': ['%D'],
        '0000010': ['%A'],
        '1000010': ['(%A)']
    };
    argsToCcode = {
        '$0': '0101010', //a+c Code
        '$1': '0111111',
        '$-1': '0111010',
        '%D': '0000010',
        '%A': '0000010',
        '(%A)':'1000010'
    };
    static cCodeToDests = {
        '000': [''],
        '100': ['%A'],
        '010': ['%D'],
        '001': ['(%A)'],
        '110': ['%A', '%D'],
        '101': ['%A', '(%A)'],
        '011': ['%D', '(%A)'],
        '111': ['%A', '%D', '(%A)'],
    };
    createDestCodeFrom(args) {
        let destCode = [0, 0, 0];
        args = args.slice(1);
        args.forEach(arg => {
            if (arg === '%A') {
                destCode[0] = 1;
            }
            if (arg === '%D') {
                destCode[1] = 1;
            }
            if (arg === '(%A)') {
                destCode[2] = 1;
            }
        });
        return destCode.join('');
    }
    static matchesCode(code) {
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);

        return (memoryBit + opCode) in this.cCodeToArgs, cCode;
    }
    static fromMachineCode(code) { 
        let memoryBit = this.extractMemoryBit(code);
        let opCode = this.extractOpCode(code);
        let cCode = memoryBit + opCode;

        let params = this.cCodeToArgs[cCode];

        let dests = this.cCodeToDests[this.extractDestCode(code)];

        let args = params.concat(dests);

        return new AddInstruction(args);
    }

    toMachineCode() {
        // setup instruction code
        let code = '111';
        // get opCode and append
        let opCode = this.argsToCcode[this.args[0]];
        code += opCode;
        // append params and destinations
        code += this.noJump(this.createDestCodeFrom(this.args));
        return code;
    }

    executeOn(system) {
        // operand 1 reg/mem
        let op1Word;
        if (this.isMemoryAccess(this.op1)) {
            op1Word = this.getMemoryAddress(system);
        } else {
            op1Word = this.getRegValue(system, this.op1);
        };

        // operand 2 reg/mem/im
        let op2Word;
        if (this.isMemoryAccess(this.op2)) {
            op2Word = this.getMemoryAddress(system);
        } else if (this.op2.startsWith('%'))  { 
            op2Word = this.getRegValue(system, this.op2);
        } else { 
            op2Word = this.getImmediateValue(this.op2);
        }

        // overwirte each destination with sum of op1Word and op2Word
        this.dest.forEach((dest) => { 
            let destWord = this.getRegValue(system, dest);
            // set result word
            destWord.set(op1Word.add(op2Word));
        });
    }
}

const mnemonicToClass = {
    'mov': MovInstruction,
    'nop': NopInstruction,
    'add': AddInstruction,
};

