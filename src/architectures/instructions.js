export class BaseInstruction {
    constructor(args, label = null) {
        this.args = args;
        this.label = label;
    }
}
