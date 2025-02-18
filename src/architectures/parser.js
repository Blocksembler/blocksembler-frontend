import {MultilineComment} from "@/architectures/instructions.js";


export class ParsingError extends Error {
    constructor(lineNumber, message) {
        super(`line ${lineNumber}: ${message}`);
    }
}

export class BaseParser {
    constructor(factory, commentChar, argSeparator, labelSeparator) {
        this.instructionFactory = factory;
        this.commentChar = commentChar;
        this.argSeparator = argSeparator;
        this.labelSeparator = labelSeparator;
    }

    parseCode(code, resolveLabels = true) {
        let sourceLines = []
        let parsedProgram = []
        code.split('\n').forEach((line, idx) => {
            sourceLines.push({lineNumber: idx, code: line.trim()})
        })

        sourceLines = this.squashEmptyLines(sourceLines).map(l => {
            let [label, mnemonic, args, comment] = this.parseLine(l.code);
            return {
                lineNumber: l.lineNumber,
                label,
                mnemonic,
                args,
                comment,
            }
        });

        sourceLines = this.squashComments(sourceLines);
        sourceLines = this.moveLabelsToNextMnemonic(sourceLines);

        const sourceMap = {}

        for (const line of sourceLines) {
            if (line.mnemonic === "" && line.comment !== "") {
                parsedProgram.push(new MultilineComment(line.comment))
            } else if (line.mnemonic !== "") {
                try {
                    let inst = this.instructionFactory.createFromMnemonic(line.mnemonic, line.args);
                    inst.label = line.label;
                    inst.comment = line.comment;

                    sourceMap[inst] = {
                        inst: line.lineNumber + 1, label: line.labelLineNr + 1
                    };

                    parsedProgram.push(inst);
                } catch (e) {
                    throw new ParsingError(line.lineNumber + 1, `Failed to parse instruction at line ${line.lineNumber + 1}`, e,);
                }
            }
        }
        if (resolveLabels) {
            return this.resolveLabels(parsedProgram, sourceMap);
        }

        return parsedProgram;
    }

    parseLine(line) {
        let label = "", mnemonic, args, comment = "";

        line = line.trim()

        if (line.indexOf(this.labelSeparator) !== -1) {
            const labelCharIdx = line.indexOf(this.labelSeparator);
            label = line.slice(0, labelCharIdx).trim();
            line = line.slice(labelCharIdx + 1).trim()
        }

        if (line.indexOf(this.commentChar) !== -1) {
            const commentCharIdx = line.indexOf(this.commentChar);
            comment = line.slice(commentCharIdx + 1).trim();
            line = line.slice(0, commentCharIdx).trim()
        }

        if (line.indexOf(' ') !== -1) {
            const spaceIdx = line.indexOf(' ')
            mnemonic = line.slice(0, spaceIdx).trim();
            line = line.slice(spaceIdx + 1).trim()
        } else {
            mnemonic = line.trim()
            line = ""
        }

        args = line.trim().split(this.argSeparator).map(item => item.trim());
        args = args.filter(e => e);

        return [label, mnemonic, args, comment];
    }

    squashEmptyLines(lines) {
        return lines.filter((elem, idx) => {
            let isEmpty = elem.code.length === 0;
            let lastWasEmpty = lines.at(idx - 1).code.length === 0
            return !isEmpty || !lastWasEmpty;
        })
    }

    squashComments(lines) {
        const result = []

        let adjacentCommentLines = [];
        let commentLineNumber = -1;

        for (const line of lines) {
            if (line.label === "" && line.mnemonic === "" && line.args.length === 0 && line.comment !== "") {
                if (commentLineNumber === -1) {
                    commentLineNumber = line.lineNumber;
                }

                adjacentCommentLines.push(line.comment);

            } else {
                if (adjacentCommentLines.length > 0) {
                    result.push({
                        commentLineNumber: commentLineNumber,
                        label: "",
                        mnemonic: "",
                        args: [],
                        comment: adjacentCommentLines.join('\n')
                    });

                    adjacentCommentLines = [];
                    commentLineNumber = -1;
                }

                result.push(line);
            }
        }

        return result;
    }

    moveLabelsToNextMnemonic(lines) {
        const result = []

        let currentLabel = ""
        let labelLine = -1

        for (const line of lines) {
            if (line.label !== "") {
                currentLabel = line.label;
                labelLine = line.lineNumber;
            }

            if (line.mnemonic !== "") {
                line.label = currentLabel;
                line.labelLineNr = labelLine;
                currentLabel = "";
                labelLine = -1;
                result.push(line);
            } else if (line.comment !== "") {
                result.push(line);
            }
        }

        return result;
    }

    resolveLabels(program, sourceMap) {
        let labelAddresses = {}
        let instructionAddress = {}

        let currentAddress = 0
        for (let inst of program) {
            if (inst.label) {
                if (inst.label in labelAddresses) {
                    throw new ParsingError(sourceMap[inst].label, `Label "${inst.label}" already defined.`);
                }

                labelAddresses[inst.label] = currentAddress;
            }
            instructionAddress[inst] = currentAddress;

            currentAddress += Number(inst.toMachineCode().length / 16);
        }

        for (const inst of program) {
            for (const argIdx in inst.args) {
                if (this.isLabelReference(inst.args[argIdx])) {
                    let label = this.labelReferenceToName(inst.args[argIdx])
                    let labelAddress = labelAddresses[label]

                    if (labelAddress === undefined) {
                        throw new ParsingError(sourceMap[inst].inst, `Label "${label}" not defined.`);
                    }

                    inst.args[argIdx] = this.labelToVal(labelAddress, instructionAddress[inst]).toString();
                }
            }
        }

        return program;
    }

    isLabelReference(arg) {
        return arg.startsWith('>')
    }

    labelReferenceToName(arg) {
        let label = arg.slice(1);
        return `@${label}`
    }

    labelToVal(labelAddress, instructionAddress) {
        return labelAddress;
    }
}
