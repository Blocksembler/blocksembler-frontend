export const formatAssemblyCode = (code, indent = 5) => {
    const lines = code.split("\n");

    let formattedCode = "";

    for (let line of lines) {
        formattedCode += formatLine(line, indent);
    }

    return `${formattedCode}`;
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
    return line.trim().startsWith("@");
};
