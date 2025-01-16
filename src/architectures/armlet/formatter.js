export const formatCode = (code, indent) => {
    const lines = code.split("\n");

    let formattedCode = "";

    for (let line of lines) {
        formattedCode += formatLine(line, indent);
    }

    return `${DEFAULT_HEADER}\n${formattedCode}`.trim();
};