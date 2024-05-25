const DEFAULT_HEADER = `
############################
# Generated Assembler Code #
############################
`;

export const formatAnnaCode = (code, indent) => {
    const lines = code.split("\n");

    let formattedCode = "";

    for (let line of lines) {
        formattedCode += formatLine(line, indent);
    }

    return `${DEFAULT_HEADER}\n${formattedCode}`.trim();
};

const formatLine = (line, indent) => {
    let formattedLine;
    if (isLabeledLine(line)) {
        let label = `${line.split(":")[0].trim()}:`;
        let instruction = line.split(":")[1].trim();
        formattedLine = `\n${label.padEnd(indent, " ")}${instruction}`;
    } else {
        formattedLine = "".padStart(indent, " ") + line.trim();
    }
    return `${formattedLine}\n`;
};

const isLabeledLine = (line) => {
    return line.indexOf(":") !== -1;
};
