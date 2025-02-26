import {BaseInstruction} from "@/architectures/instructions.js";
import {Word} from "@/architectures/system.js";

export class SimpleMipsInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        const instClass = instructionClasses.filter(instClass => instClass.mnemonic === mnemonic)[0];

        if (!instClass) {
            throw new Error(`No instruction for mnemonic "${mnemonic}" found.`);
        }

        return new instClass(args);
    }

    createFromOpCode(memory, address) {
        const opCode = memory[address].toBitString().slice(6, 9);
        const instClass = instructionClasses.filter(instClass => instClass.opCode === opCode)[0];

        if (!instClass) {
            throw new Error(`No instruction for opCode "${opCode}" found.`);
        }

        return instClass.fromMachineCode(memory[address]);
    }
}

export class AbstractSimpleMipsInstruction extends BaseInstruction {
    get operandArg() {
        if (this.args.length === 0) {
            return "";
        }

        return this.args[0]
    }

    static fromMachineCode(word) {
        const instString = word.toBitString();
        const regSlice = instString.slice(12);
        return new this([`R${parseInt(regSlice, 2)}`])
    }

    toString() {
        return `${this.constructor.mnemonic} ${this.args.join(" ")}`
    }

    toMachineCode() {
        const operandIndicator = !this.operandArg.startsWith('R') ? "1" : "0";

        let operand;

        if (this.operandArg === "") {
            operand = "000000";
        } else if (operandIndicator === "0") {
            operand = Number(this.args[0].slice(1)).toString(2);
        } else {
            operand = Number(this.args[0]).toString(2);
        }

        return `000000${this.constructor.opCode}${operandIndicator}${operand.padStart(6, "0")}`
    }

    toBlocks(ws) {
        let newBlock = ws.newBlock(this.constructor.mnemonic.toLowerCase());
        newBlock.initSvg()

        if (this.operandArg.startsWith("R")) {
            let registerBlock = ws.newBlock('register');
            registerBlock.initSvg();

            registerBlock.setFieldValue(Number(this.operandArg.slice(1)), "value");
            newBlock.getInput('operand').connection.connect(registerBlock.outputConnection);

        } else if (this.operandArg !== "") {
            let immediateBlock = ws.newBlock('decImmediate');
            immediateBlock.initSvg();

            immediateBlock.setFieldValue(Number(this.operandArg), "value");

            newBlock.getInput('operand').connection.connect(immediateBlock.outputConnection);
        }

        return [newBlock];
    }

}

export class NopInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "NOOP";
    }

    static get opCode() {
        return "000";
    }

    executeOn(system) {
        // Do nothing!
    }
}

export class LoadInstruction extends AbstractSimpleMipsInstruction {

    static get mnemonic() {
        return "LOAD";
    }

    static get opCode() {
        return "001";
    }

    static fromMachineCode(word) {
        const instString = word.toBitString();

        if (instString[9] === "0") {
            const regSlice = instString.slice(12);
            return new this([`R${parseInt(regSlice, 2)}`])
        }

        const immediate = instString.slice(10);
        return new this([parseInt(immediate, 2).toString()]);
    }

    executeOn(system) {
        let val;
        if (this.operandArg.startsWith("R")) {
            val = system.registers[this.operandArg];
        } else {
            val = Word.fromSignedIntValue(parseInt(this.operandArg));
        }

        system.registers.ACC.set(val);
    }
}

export class MoveInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "MOVE";
    }

    static get opCode() {
        return "010";
    }

    executeOn(system) {
        system.registers[this.operandArg].set(system.registers.ACC);
    }
}

export class AddInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "ADD";
    }

    static get opCode() {
        return "011";
    }

    executeOn(system) {
        system.registers.ACC.set(system.registers.ACC.add(system.registers[this.operandArg]));
    }
}

export class SubInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "SUB";
    }

    static get opCode() {
        return "100";
    }

    executeOn(system) {
        system.registers.ACC.set(system.registers.ACC.subtract(system.registers[this.operandArg]));
    }
}

export class EqualInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "EQUAL";
    }

    static get opCode() {
        return "101";
    }

    executeOn(system) {
        // TODO
    }
}

export class JumpInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "JUMP";
    }

    static get opCode() {
        return "110";
    }

    executeOn(system) {
        // TODO
    }
}

export class HaltInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "HALT";
    }

    static get opCode() {
        return "111";
    }

    executeOn(system) {
        system.callInterrupt('alert', 'The program terminated');
    }
}

const instructionClasses = [
    NopInstruction,
    LoadInstruction,
    MoveInstruction,
    AddInstruction,
    SubInstruction,
    EqualInstruction,
    JumpInstruction,
    HaltInstruction,
]