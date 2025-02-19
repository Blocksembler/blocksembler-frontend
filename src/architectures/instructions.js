export class BaseInstruction {
    constructor(args = [], label = "", comment = "") {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}

export class PseudoInstruction {
    constructor(args, label = "", comment = "") {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}

export class MultilineComment {
    constructor(text) {
        this.text = text;
    }

    toString() {
        return this.text;
    }

    toMachineCode() {
        return "";
    }

    toBlock(ws) {
        let multilineCommentBlock = ws.newBlock('comment')
        multilineCommentBlock.initSvg()
        multilineCommentBlock.getField('text').setValue(this.text);

        multilineCommentBlock.setCollapsed(true);
        return multilineCommentBlock
    }
}