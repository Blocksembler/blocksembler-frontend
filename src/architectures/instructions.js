export class BaseInstruction {
    constructor(args, label = null, comment = null) {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}

export class PseudoInstruction {
    constructor(args, label = null, comment = null) {
        this.args = args;
        this.label = label;
        this.comment = comment;
    }
}