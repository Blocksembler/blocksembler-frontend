import Blockly from "blockly";
import {BaseEmulator} from "@/architectures/emulator";

export class BaseInstruction {
    args: Array<string>;
    labels: Array<string>;
    comment: string;

    constructor(args: Array<string> = [], labels: Array<string> = [], comment: string = "") {
        this.args = args;
        this.labels = labels;
        this.comment = comment;
    }

    toString(): string {
        return "";
    }

    toMachineCode(): string {
        return "";
    }

    toBlocks(ws: Blockly.Workspace): Array<Blockly.Block> {
        return [];
    }

    executeOn(_e: BaseEmulator): void {
    }
}

export class PseudoInstruction {
    args: Array<string>;
    labels: Array<string>;
    comment: string;

    constructor(args: Array<string> = [], labels: Array<string> = [], comment: string = "") {
        this.args = args;
        this.labels = labels;
        this.comment = comment;
    }

    toString(): string {
        return "";
    }

    toMachineCode(): string {
        return "";
    }

    toBlocks(ws: Blockly.Workspace): Array<Blockly.Block> {
        return [];
    }

    executeOn(_e: BaseEmulator): void {
    }
}

export class MultilineComment extends PseudoInstruction {
    text: string;

    constructor(text: string) {
        super([], [], "");
        this.text = text;
    }

    toString() {
        return this.text;
    }

    toMachineCode() {
        return "";
    }

    toBlocks(ws: Blockly.Workspace): Array<Blockly.Block> {
        let multilineCommentBlock = ws.newBlock('comment');
        multilineCommentBlock.initModel();
        multilineCommentBlock.getField('text')?.setValue(this.text);
        multilineCommentBlock.setCollapsed(true);
        return [multilineCommentBlock]
    }
}