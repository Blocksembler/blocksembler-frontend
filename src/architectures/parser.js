export class ParsingError extends Error {
    constructor(lineNumber, message) {
        super(`line ${lineNumber}: ${message}`);
    }
}