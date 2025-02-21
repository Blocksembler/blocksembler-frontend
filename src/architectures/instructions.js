export class BaseInstruction {
    constructor(args = [], labels = [], comment = "") {
        this.args = args;
        this.labels = labels;
        this.comment = comment;
    }
}

export class PseudoInstruction {
    constructor(args, labels = [], comment = "") {
        this.args = args;
        this.labels = labels;
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

    toBlocks(ws) {
        let multilineCommentBlock = ws.newBlock('comment')
        multilineCommentBlock.initSvg()
        multilineCommentBlock.getField('text').setValue(this.text);

        multilineCommentBlock.setCollapsed(true);
        return [multilineCommentBlock]
    }
}