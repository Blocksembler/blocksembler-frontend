export class BaseFormatter {
    labelIndent: number;
    instructionIndent: number;
    labelChar: string;
    commentChar: string;

    constructor(labelIndent = 10, instructionIndent = 20, labelChar = ":", commentChar = "#") {
        this.labelIndent = labelIndent;
        this.instructionIndent = instructionIndent;
        this.labelChar = labelChar;
        this.commentChar = commentChar;
    }

    formatCode(code: string) {
        const lines = code.split("\n");
        return lines.map(line => this.formatLine(line)).join('\n');
    };

    formatLine(line: string) {
        const labelEnd = line.indexOf(this.labelChar);
        const commentStart = line.indexOf(this.commentChar);

        let label = "", instruction, comment = "";

        if (commentStart !== -1) {
            comment = `# ${line.slice(commentStart + 1).trim()}`;
            line = line.slice(0, commentStart);
        }

        if (labelEnd !== -1) {
            label = line.slice(0, labelEnd + 1).trim();
            line = line.slice(labelEnd + 1).trim();
        }

        label = label.padEnd(this.labelIndent, " ")

        instruction = line.trim().padEnd(this.instructionIndent, " ")

        if (instruction.trim() === "" && label.trim() === "") {
            return ` ${comment}`;
        }

        return `${label}${instruction}${comment}`;
    }
}
