export class BaseFormatter {
    constructor(labelIndent, instructionIndent, labelChar = ":", commentChar = "#") {
        this.labelIndent = labelIndent;
        this.instructionIndent = instructionIndent;
        this.labelChar = labelChar;
        this.commentChar = commentChar;
    }

    formatCode = (code) => {
        const lines = code.split("\n");
        return lines.map(line => this.formatLine(line)).join('\n');
    };

    formatLine(line) {
        const labelEnd = line.indexOf(this.labelChar);
        const commentStart = line.indexOf(this.commentChar);

        let label = "", instruction, comment = "";

        if (commentStart !== -1) {
            comment = line.slice(commentStart).trim();
            line = line.slice(0, commentStart);
        }

        if (labelEnd !== -1) {
            label = line.slice(0, labelEnd + 1).trim();
            line = line.slice(labelEnd + 1)
        }

        label = label.padEnd(this.labelIndent, " ")

        instruction = line.trim().padEnd(this.instructionIndent, " ")

        if (instruction.trim() === "" && label.trim() === "") {
            return ` ${comment}`;
        }

        return `${label}${instruction}${comment}`;
    }
}
