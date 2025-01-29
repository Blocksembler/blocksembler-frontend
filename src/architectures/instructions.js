export class BaseInstruction {
    constructor(args, label = null, comment = "") {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}

export class PseudoInstruction {
    constructor(args, label = null, comment = "") {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}