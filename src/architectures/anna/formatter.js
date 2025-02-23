import {BaseFormatter} from "@/architectures/formatter.js";

export class AnnaCodeFormatter extends BaseFormatter {
    constructor() {
        super(10, 20, ':', '#');

    }

    formatCode(code) {
        let codeLines = code.split("\n").map(line => line.trim());

        codeLines = codeLines.reduce((codeLines, line) => {
            const lastLine = codeLines[codeLines.length - 1];

            if (lastLine !== undefined && lastLine.endsWith(':')) {
                const mergedLine = codeLines[codeLines.length - 1] + line;
                codeLines[codeLines.length - 1] = "";
                codeLines.push(mergedLine);
            } else {
                codeLines.push(line);
            }

            return codeLines;
        }, []);

        return super.formatCode(codeLines.join("\n"));
    }
}