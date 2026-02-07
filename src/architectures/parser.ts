import {BaseInstruction, MultilineComment} from "@/architectures/instructions";
import {Instruction, InstructionFactory} from "@/types/emulator";


export class ParsingError extends Error {
    constructor(lineNumber: number, message: string) {
        super(`line ${lineNumber}: ${message}`);
    }
}

type SourceLine = {
    lineNumber: number,
    labels: Array<string>,
    mnemonic: string,
    args: Array<string>,
    comment: string,
};


export class BaseParser {
    instructionFactory: InstructionFactory;
    commentChar: string;
    argSeparator: string
    labelSeparator: string
    addressSize: number;

    labelLineNumbers: Record<string, number>;

    constructor(factory: InstructionFactory, commentChar: string, argSeparator: string,
                labelSeparator: string, addressSize: number = 16) {
        this.instructionFactory = factory;
        this.commentChar = commentChar;
        this.argSeparator = argSeparator;
        this.labelSeparator = labelSeparator;
        this.addressSize = addressSize;
        this.labelLineNumbers = {};
    }

    parseCode(code: string, resolveLabels: boolean = true): Array<Instruction> {

        let numberedLines: Array<{ lineNr: number, code: string }> = []
        let sourceLines: Array<SourceLine>;

        code.split('\n').forEach((line: string, idx: number): void => {
            if (line.trim().length !== 0) {
                numberedLines.push({lineNr: idx + 1, code: line.trim()});
            }
        })

        sourceLines = numberedLines.map(line => this.parseLine(line.lineNr, line.code))

        sourceLines = this.squashComments(sourceLines);
        sourceLines = this.moveLabelsToNextMnemonic(sourceLines);

        let parsedProgram: Array<Instruction> = sourceLines
            .filter(line => line.mnemonic !== "" || line.comment !== "")
            .map(line => this.codeToInstruction(line));

        if (resolveLabels) {
            return this.resolveLabels(parsedProgram);
        }

        return parsedProgram;
    }

    codeToInstruction(line: SourceLine): Instruction {
        if (line.mnemonic === "" && line.comment !== "") {
            return new MultilineComment(line.comment)
        }

        try {
            let inst: Instruction = this.instructionFactory.createFromMnemonic(line.mnemonic, line.args);
            inst.labels = line.labels;
            inst.comment = line.comment;
            return inst;
        } catch (e) {
            if (e instanceof Error) {
                throw new ParsingError(line.lineNumber, e.message);
            }
            throw new ParsingError(line.lineNumber, `Failed to parse instruction at line ${line.lineNumber}`);
        }
    }

    parseLine(lineNumber: number, code: string): SourceLine {
        let label: string = "";
        let comment: string = "";
        let mnemonic: string;
        let args: Array<string>;

        code = code.trim()

        if (code.indexOf(this.commentChar) !== -1) {
            const commentCharIdx = code.indexOf(this.commentChar);
            comment = code.slice(commentCharIdx + 1);
            code = code.slice(0, commentCharIdx).trim()
        }

        if (code.indexOf(this.labelSeparator) !== -1) {
            const labelCharIdx = code.indexOf(this.labelSeparator);
            label = code.slice(0, labelCharIdx).trim();
            code = code.slice(labelCharIdx + 1).trim()
        }

        if (code.indexOf(' ') !== -1) {
            const spaceIdx = code.indexOf(' ')
            mnemonic = code.slice(0, spaceIdx).trim();
            code = code.slice(spaceIdx + 1).trim()
        } else {
            mnemonic = code.trim()
            code = ""
        }

        args = code.trim().split(this.argSeparator).map(item => item.trim());
        args = args.filter(e => e);

        const labels = label !== "" ? [label] : [];
        this.labelLineNumbers[label] = lineNumber;

        return {
            lineNumber,
            labels,
            mnemonic,
            args,
            comment
        };
    }

    squashComments(lines: Array<SourceLine>): Array<SourceLine> {
        const result: Array<SourceLine> = []

        let adjacentCommentLines = [];
        let commentLineNumber = -1;

        for (const line of lines) {
            if (line.labels.length === 0 && line.mnemonic === "" && line.args.length === 0 && line.comment !== "") {
                if (commentLineNumber === -1) {
                    commentLineNumber = line.lineNumber;
                }

                adjacentCommentLines.push(line.comment);

            } else {
                if (adjacentCommentLines.length > 0) {
                    result.push({
                        lineNumber: commentLineNumber,
                        labels: [],
                        mnemonic: "",
                        args: [],
                        comment: adjacentCommentLines.join('\n'),
                    });

                    adjacentCommentLines = [];
                    commentLineNumber = -1;
                }

                result.push(line);
            }
        }

        if (adjacentCommentLines.length > 0) {
            result.push({
                lineNumber: commentLineNumber,
                labels: [],
                mnemonic: "",
                args: [],
                comment: adjacentCommentLines.join('\n'),
            });
        }

        return result;
    }

    moveLabelsToNextMnemonic(lines: Array<SourceLine>): Array<SourceLine> {
        const result: Array<SourceLine> = []

        let currentLabels: Array<string> = []

        for (const line of lines) {

            for (let label of line.labels) {
                if (label.startsWith('&')) {
                    throw new ParsingError(line.lineNumber, "Labels must not start with '&'!");
                }
            }

            if (line.labels) {
                currentLabels = currentLabels.concat(line.labels);
            }

            if (line.mnemonic !== "") {
                line.labels = currentLabels;
                currentLabels = [];
                result.push(line);
            } else if (line.comment !== "") {
                result.push(line);
            }
        }

        return result;
    }

    resolveLabels(program: Array<Instruction>): Array<Instruction> {
        let labelAddresses: Record<string, number> = {}
        let instructionAddress: Record<number, number> = {}

        let currentAddress = 0
        for (let instIdx in program) {
            if (program[instIdx].labels && program[instIdx].labels.length > 0) {
                for (let label of program[instIdx].labels) {
                    if (label in labelAddresses) {
                        throw new ParsingError(this.labelLineNumbers[label], `Label "${label}" already defined.`);
                    }

                    labelAddresses[label] = currentAddress;
                }
            }

            instructionAddress[instIdx] = currentAddress;
            currentAddress += Math.floor(Number(program[instIdx].toMachineCode().length / this.addressSize));
        }

        for (const instIdx in program) {

            for (const argIdx in program[instIdx].args) {
                if (this.isLabelReference(program[instIdx].args[argIdx])) {
                    let label = this.labelReferenceToName(program[instIdx].args[argIdx])
                    let labelAddress = labelAddresses[label]
                    const instruction = program[instIdx];

                    if (labelAddress === undefined) {
                        throw new ParsingError(instructionAddress[instIdx] + 1, `Label "${label}" not defined.`);
                    }

                    instruction.args[argIdx] = this.labelToVal(labelAddress, instructionAddress[instIdx], instruction).toString();
                }
            }
        }

        return program;
    }

    isLabelReference(arg: string): boolean {
        return arg.startsWith('>')
    }

    labelReferenceToName(arg: string): string {
        let label = arg.slice(1);
        return `@${label}`
    }

    labelToVal(labelAddress: number, _instructionAddress: number, _instruction: BaseInstruction) {
        return labelAddress;
    }
}
