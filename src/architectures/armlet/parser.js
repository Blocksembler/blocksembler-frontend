import {MultilineComment} from "@/architectures/armlet/instructions.js";
import {ParsingError} from "@/architectures/parser.js";

export class ArmletAssemblyParser {
    constructor(factory) {
        this.instructionFactory = factory;
    }

    parseCode(code, resolveLabels = true) {
        let sourceLines = []
        let parsedProgram = []
        code.split('\n').forEach((line, idx) => {
            sourceLines.push({lineNumber: idx, code: line.trim()})
        })

        sourceLines = this.squashEmptyLines(sourceLines);
        sourceLines = this.categorizeLines(sourceLines);

        const sourceMap = {}

        for (const line of sourceLines) {
            if (line.type === 'comment') {
                parsedProgram.push(new MultilineComment(line.comment))
            } else if (line.type === 'instruction') {
                try {
                    let comment = this.extractComment(line.code);
                    let mnemonic = this.extractMnemonic(line.code);
                    let args = this.extractArgs(line.code);

                    let inst = this.instructionFactory.createFromMnemonic(mnemonic, args);
                    inst.label = line.label;
                    inst.comment = comment;

                    sourceMap[inst] = {
                        inst: line.lineNumber + 1,
                        label: line.labelLineNr + 1
                    };

                    parsedProgram.push(inst);
                } catch (e) {
                    throw new ParsingError(line.lineNumber + 1,
                        `Failed to parse instruction at line ${line.lineNumber + 1}`,
                        e,);
                }
            }
        }
        if (resolveLabels) {
            return this.resolveLabels(parsedProgram, sourceMap);
        }

        return parsedProgram;
    }

    extractComment(code) {
        code = code.trim()
        let hashIdx = code.indexOf('#');

        if (hashIdx !== -1) {
            return code.slice(hashIdx + 1).trim();
        }

        return "";
    }

    extractMnemonic(code) {
        code = code.trim()
        let spaceIdx = code.indexOf(' ');

        if (spaceIdx !== -1) {
            return code.slice(0, spaceIdx).trim();
        }

        return code
    }

    extractArgs(code) {
        code = code.trim()
        if (code.indexOf('#') !== -1) {
            code = code.slice(0, code.indexOf('#')).trim();
        }

        let firstSpaceIdx = code.indexOf(' ');

        if (firstSpaceIdx !== -1) {
            return code.slice(firstSpaceIdx + 1)
                .trim().split(',')
                .map(item => item.trim());
        }

        return []
    }

    squashEmptyLines(instructions) {
        return instructions.filter((elem, idx) => {
            let isEmpty = elem.code.length === 0;
            let lastWasEmpty = instructions.at(idx - 1).code.length === 0
            return !isEmpty || !lastWasEmpty;
        })
    }

    categorizeLines(lines) {
        let newLines = [];

        let label = null;
        let labelLineNr = -1;
        let multiLineComment = [];

        for (let line of lines) {
            if (line.code.length === 0) {
                if (multiLineComment.length > 0) {
                    newLines.push({type: "comment", comment: multiLineComment.join('\n')})
                    multiLineComment = [];
                }
            } else if (line.code.startsWith('#')) {
                multiLineComment.push(line.code.slice(1).trim());
            } else if (line.code.startsWith('@')) {
                label = line.code.slice(0, line.code.indexOf(':'));
                labelLineNr = line.lineNumber

                let command = line.code.split(':')[1].trim()

                if (command.length > 0) {
                    line.code = command
                    newLines.push({
                        type: "instruction",
                        label: label,
                        labelLineNr: labelLineNr,
                        ...line
                    });

                    label = null;
                    labelLineNr = -1
                }

            } else {
                newLines.push({
                    type: "instruction",
                    label: label,
                    labelLineNr: labelLineNr,
                    ...line
                });

                label = null
                labelLineNr = -1;
            }
        }

        return newLines;
    }

    resolveLabels(program, sourceMap) {
        let labelAddresses = {}

        let currentAddress = 0
        for (let inst of program) {
            if (inst.label) {
                if (inst.label in labelAddresses) {
                    throw new ParsingError(sourceMap[inst].label, `Label "${inst.label}" already defined.`);
                }

                labelAddresses[inst.label] = currentAddress;
            }

            currentAddress += Number(inst.toMachineCode().length / 16);
        }

        for (const inst of program) {
            for (const argIdx in inst.args) {
                if (inst.args[argIdx].startsWith(">")) {
                    let label = inst.args[argIdx].slice(1);
                    let val = labelAddresses[`@${label}`]

                    if (!val) {
                        throw new ParsingError(sourceMap[inst].inst, `Label "${label}" not defined.`);
                    }

                    inst.args[argIdx] = val.toString();
                }
            }
        }

        return program;
    }
}
