import {BaseInstruction} from "@/architectures/instructions.js";
import {Word} from "@/architectures/system.js";

export class SimpleRISCInstructionFactory {
    createFromMnemonic(mnemonic, args) {
        const instClass = instructionClasses.filter(instClass => instClass.mnemonic === mnemonic)[0];

        if (!instClass) {
            throw new Error(`No instruction for mnemonic "${mnemonic}" found.`);
        }

        return new instClass(args);
    }

    createFromOpCode(memory, address) {
        const opCode = memory[address].toBitString().slice(3, 7);
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

    static extractArgs(word) {
        const bitString = word.toBitString();
        const immediateFlag = bitString[7];

        if (immediateFlag === "1") {
            const regStr = bitString.slice(12);
            return [`$${parseInt(regStr, 2)}`]
        }

        const immediateWord = Word.fromString(bitString.slice(8), 8);
        return [immediateWord.toUnsignedIntValue().toString()]
    }

    static fromMachineCode(word) {
        return new this(this.extractArgs(word))
    }

    resolvedOperand(system) {
        if (this.operandArg.startsWith("$")) {
            const reg = `$${this.operandArg.slice(1)}`;
            return system.registers[reg];
        } else {
            let immediate = parseInt(this.operandArg) > 255 ? 255 : parseInt(this.operandArg);
            return Word.fromSignedIntValue(immediate, 8);
        }
    }


    toString() {
        if (this.operandArg) {
            return `${this.constructor.mnemonic} ${this.operandArg}`
        }

        return this.constructor.mnemonic
    }

    toMachineCode() {
        const preFix = "000"
        const opCode = this.constructor.opCode;

        let mode, arg;

        if (this.operandArg.startsWith("$")) {
            mode = "1"
            arg = parseInt(this.operandArg.slice(1)).toString(2)
        } else {
            mode = "0";
            if (this.operandArg === "") {
                arg = "0";
            } else {
                const argWord = Word.fromSignedIntValue(parseInt(this.operandArg), 8)
                arg = argWord.toBitString()
            }
        }

        arg = arg.padStart(8, "0");

        return `${preFix}${opCode}${mode}${arg}`
    }

    toBlocks(ws) {
        let newBlock = ws.newBlock(this.constructor.mnemonic.toLowerCase());
        newBlock.initSvg()

        if (this.operandArg.startsWith("$")) {
            let registerBlock = ws.newBlock('register');
            registerBlock.initSvg();

            registerBlock.setFieldValue(Number(this.operandArg.slice(1)), "value");
            newBlock.getInput('operand').connection.connect(registerBlock.outputConnection);

        } else if (this.operandArg.startsWith(">")) {
            try {
                let labelBlock = ws.newBlock('label');
                labelBlock.initSvg();

                labelBlock.setFieldValue(this.operandArg.slice(1), "value");
                newBlock.getInput('operand').connection.connect(labelBlock.outputConnection);
            } catch (e) {
                console.log(e);
            }
        } else if (this.operandArg !== "") {
            let immediateBlock = ws.newBlock('immediate');
            immediateBlock.initSvg();

            immediateBlock.setFieldValue(Number(this.operandArg), "value");

            newBlock.getInput('operand').connection.connect(immediateBlock.outputConnection);
        }

        const blocks = this.labels.map(label => {
            const labelBlock = ws.newBlock('labelDef');
            labelBlock.initSvg();
            labelBlock.setFieldValue(label.name.slice(1), "label");
            return labelBlock;
        })

        blocks.push(newBlock);

        for (let i = 0; i < blocks.length - 1; i++) {
            blocks[i].nextConnection.connect(blocks[i + 1].previousConnection);
        }

        return blocks;
    }

}

export class NopInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "NOOP";
    }

    static get opCode() {
        return "0000";
    }

    static extractArgs(word) {
        return [];
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
        return "0001";
    }

    executeOn(system) {
        let operandWord = this.resolvedOperand(system);
        system.registers.$ACC.set(Word.fromString(operandWord.toBitString()));
    }
}

export class MoveInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "MOVE";
    }

    static get opCode() {
        return "0010";
    }

    executeOn(system) {
        if (!this.operandArg.startsWith("$")) {
            throw Error("invalid argument")
        }

        system.registers[this.operandArg].set(system.registers.$ACC);
    }
}

export class AddInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "ADD";
    }

    static get opCode() {
        return "0011";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.add(argWord));
    }
}

export class SubInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "SUB";
    }

    static get opCode() {
        return "0100";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.subtract(argWord));
    }
}

export class AndInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "AND";
    }

    static get opCode() {
        return "0101";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.and(argWord));
    }
}


export class OrInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "OR";
    }

    static get opCode() {
        return "0110";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.xor(argWord));
    }
}


export class XorInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "XOR";
    }

    static get opCode() {
        return "0111";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.xor(argWord));
    }
}

export class NotInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "NOT";
    }

    static get opCode() {
        return "1000";
    }

    static extractArgs(word) {
        return [];
    }

    executeOn(system) {
        system.registers.$ACC.set(system.registers.$ACC.invert());
    }
}

export class LeftShiftInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "LSHIFT";
    }

    static get opCode() {
        return "1001";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.shift(argWord.toSignedIntValue()));
    }
}

export class RightShiftInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "RSHIFT";
    }

    static get opCode() {
        return "1010";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);
        system.registers.$ACC.set(system.registers.$ACC.shift(-1 * argWord.toSignedIntValue()));
    }
}

export class CompareInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "COMPARE";
    }

    static get opCode() {
        return "1011";
    }

    executeOn(system) {
        const argWord = this.resolvedOperand(system);

        system.registers.STATUS_EQ.set(Word.fromString("0", 1))
        system.registers.STATUS_GT.set(Word.fromString("0", 1))

        if (argWord.toSignedIntValue() === system.registers.$ACC.toSignedIntValue()) {
            system.registers.STATUS_EQ.set(Word.fromString("1", 1))
        }

        if (system.registers.$ACC > argWord.toSignedIntValue()) {
            system.registers.STATUS_GT.set(Word.fromString("1", 1))
        }
    }
}

export class JumpInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "JUMP";
    }

    static get opCode() {
        return "1100";
    }

    executeOn(system) {
        const operandWord = this.resolvedOperand(system);

        system.registers.pc.set(system.registers.pc
            .add(operandWord));
    }
}

export class BranchIfEqualInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "BEQ";
    }

    static get opCode() {
        return "1101";
    }

    executeOn(system) {
        const operandWord = this.resolvedOperand(system);

        if (system.registers.STATUS_EQ.toBitString() === "1") {
            const nextPC = system.registers.pc.toUnsignedIntValue() + operandWord.toSignedIntValue()
            system.registers.pc.set(Word.fromSignedIntValue(nextPC, 16));
        }
    }
}

export class BranchIfGreaterThanInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "BGT";
    }

    static get opCode() {
        return "1110";
    }

    executeOn(system) {
        const operandWord = this.resolvedOperand(system);

        if (system.registers.STATUS_GT.toBitString() === "1") {
            system.registers.pc.set(system.registers.pc
                .add(operandWord))
        }
    }
}

export class HaltInstruction extends AbstractSimpleMipsInstruction {
    static get mnemonic() {
        return "HALT";
    }

    static get opCode() {
        return "1111";
    }

    static extractArgs(word) {
        return [];
    }

    executeOn(system) {
        system.callInterrupt('hlt');
    }
}

const instructionClasses = [
    NopInstruction,
    LoadInstruction,
    MoveInstruction,
    AddInstruction,
    SubInstruction,
    AndInstruction,
    OrInstruction,
    XorInstruction,
    NotInstruction,
    LeftShiftInstruction,
    RightShiftInstruction,
    CompareInstruction,
    JumpInstruction,
    BranchIfEqualInstruction,
    BranchIfGreaterThanInstruction,
    HaltInstruction
]