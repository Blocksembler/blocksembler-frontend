import {MultilineComment} from "@/architectures/instructions.js";


export class ParsingError extends Error {
    constructor(lineNumber, message) {
        super(`line ${lineNumber}: ${message}`);
    }
}

export class BaseParser {
    constructor(factory, commentChar, argSeparator, labelSeparator, addressSize = 16) {
        this.instructionFactory = factory;
        this.commentChar = commentChar;
        this.argSeparator = argSeparator;
        this.labelSeparator = labelSeparator;
        this.addressSize = addressSize;
    }

    parseCode(code, resolveLabels = true) {
        let sourceLines = []
        let parsedProgram = []
        code.split('\n').forEach((line, idx) => {
            sourceLines.push({lineNumber: idx + 1, code: line.trim()})
        })

        sourceLines = this.squashEmptyLines(sourceLines).map(l => {
            let [labels, mnemonic, args, comment] = this.parseLine(l);
            return {
                lineNumber: l.lineNumber,
                labels: labels,
                mnemonic,
                args,
                comment,
            }
        });

        sourceLines = this.squashComments(sourceLines);
        sourceLines = this.moveLabelsToNextMnemonic(sourceLines);

        const instLineNumberMap = {}

        for (const line of sourceLines) {
            if (line.mnemonic === "" && line.comment !== "") {
                parsedProgram.push(new MultilineComment(line.comment))
            } else if (line.mnemonic !== "") {
                try {
                    let inst = this.instructionFactory.createFromMnemonic(line.mnemonic, line.args);
                    inst.labels = line.labels;
                    inst.comment = line.comment;

                    instLineNumberMap[inst] = line.lineNumber;

                    parsedProgram.push(inst);
                } catch (e) {
                    throw new ParsingError(line.lineNumber, `Failed to parse instruction at line ${line.lineNumber}`, e,);
                }
            }
        }
        if (resolveLabels) {
            return this.resolveLabels(parsedProgram, instLineNumberMap);
        }

        return parsedProgram;
    }

    parseLine(line) {
        let label = "", mnemonic, args, comment = "";


        let code = line.code.trim()

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

        const labels = label !== "" ? [{name: label, lineNumber: line.lineNumber}] : [];

        return [labels, mnemonic, args, comment];
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
            if (line.labels.length === 0 && line.mnemonic === "" && line.args.length === 0 && line.comment !== "") {
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

        if (adjacentCommentLines.length > 0) {
            result.push({
                commentLineNumber: commentLineNumber,
                label: "",
                mnemonic: "",
                args: [],
                comment: adjacentCommentLines.join('\n')
            });
        }

        return result;
    }

    moveLabelsToNextMnemonic(lines) {
        const result = []

        let currentLabels = []

        for (const line of lines) {
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

    resolveLabels(program, sourceMap) {
        let labelAddresses = {}
        let instructionAddress = {}

        let currentAddress = 0
        for (let inst of program) {
            if (inst.labels && inst.labels.length > 0) {
                for (let label of inst.labels) {
                    if (label.name in labelAddresses) {
                        throw new ParsingError(label.lineNumber, `Label "${label.name}" already defined.`);
                    }

                    labelAddresses[label.name] = currentAddress;
                }
            }
            instructionAddress[inst] = currentAddress;

            currentAddress += Math.floor(Number(inst.toMachineCode().length / this.addressSize));
        }

        for (const inst of program) {
            for (const argIdx in inst.args) {
                if (this.isLabelReference(inst.args[argIdx])) {
                    let label = this.labelReferenceToName(inst.args[argIdx])
                    let labelAddress = labelAddresses[label]

                    if (labelAddress === undefined) {
                        throw new ParsingError(sourceMap[inst], `Label "${label}" not defined.`);
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
