import {BaseFormatter} from "@/architectures/formatter";

export class AnnaCodeFormatter extends BaseFormatter {
    constructor() {
        super(10, 20, ':', '#');

    }

    formatCode(code: string): string {
        let codeLines: Array<string> = code.split("\n").map(line => line.trim());

        codeLines = codeLines.reduce((codeLines: Array<string>, line) => {
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