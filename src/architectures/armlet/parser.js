import {MultilineComment} from "@/architectures/armlet/instructions.js";

export class ArmletAssemblyParser {
    constructor(factory) {
        this.instructionFactory = factory;
    }

    parseCode(code) {
        let lines = code.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
        let parsedProgram = [];

        let idx = 0;

        let multilineComment = "";

        while (idx < lines.length) {
            let separatedLine = this.separateInstructionAndComment(lines[idx]);
            let instruction = separatedLine.instruction;
            let comment = separatedLine.comment;

            if (instruction) {
                if (instruction.endsWith(':')) {
                    let nextCommand = this.separateInstructionAndComment(lines[idx + 1])
                    idx += 1;
                    instruction += " " + nextCommand.instruction;
                    if (comment.length > 0) {
                        comment += "\n";
                    }
                    comment += nextCommand.comment;
                }

                parsedProgram.push(this.parseInstructionLine(instruction, comment));

                if (multilineComment.length > 0) {
                    parsedProgram.push(new MultilineComment(multilineComment));
                    multilineComment = "";
                }

            } else if (comment) {
                multilineComment += `${comment}\n`;
            } else if (multilineComment.length > 0) {
                parsedProgram.push(new MultilineComment(multilineComment));
                multilineComment = "";
            }

            idx += 1;
        }

        return this.resolveLabels(parsedProgram);
    }

    separateInstructionAndComment(line) {
        let commentStart = line.indexOf('#')

        if (commentStart < 0) {
            return {'instruction': line.trim(), 'comment': ''};
        }
        return {'instruction': line.slice(0, commentStart).trim(), 'comment': line.slice(commentStart + 1).trim()}
    }

    parseInstructionLine(instruction, comment) {
        let tokens = instruction.split(" ").map(token => token.trim()).filter((token) => token.length > 0);

        let label = this.extractLabel(tokens);
        let type = this.extractType(tokens);

        for (let idx in tokens) {
            if (tokens[idx].endsWith(",")) {
                tokens[idx] = tokens[idx].substring(0, tokens[idx].length - 1).trim();
            }
        }

        let inst = this.instructionFactory.createFromMnemonic(type, tokens);
        inst.comment = comment;
        inst.label = label;
        return inst;
    }

    extractLabel(tokens) {
        if (tokens[0].endsWith(":")) {
            let label = tokens.splice(0, 1)[0];
            label = label.slice(0, label.length - 1);
            return label;
        }

        return null;
    }

    extractType(tokens) {
        let type = tokens.splice(0, 1);
        return type[0];
    }

    resolveLabels(program) {
        let labelAddresses = {};

        let address = 0
        for (let instruction of program) {
            if (instruction.label) {
                labelAddresses[instruction.label] = address;
            }

            let instructionSize = instruction.toMachineCode().length / 16
            address += instructionSize
        }

        program.forEach((instruction, _address) => {
            for (let idx in instruction.args) {
                let args = instruction.args;
                if (args[idx][0] === ">") {
                    args[idx] = labelAddresses['@' + args[idx].slice(1)].toString();
                }
            }
        });

        return program;
    }
}
