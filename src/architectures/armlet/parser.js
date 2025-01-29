export class ArmletAssemblyParser {
    constructor(factory) {
        this.instructionFactory = factory;
    }

    parseCode(code) {
        let lines = code.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
        let parsedProgram = [];

        let idx = 0;
        while (idx < lines.length) {
            let trimmedLine = this.trimComments(lines[idx]);

            if (trimmedLine.endsWith(':')) {
                let nextCommand = this.trimComments(lines[idx + 1])
                idx += 1;
                trimmedLine += " " + nextCommand;
            }

            if (trimmedLine) {
                parsedProgram.push(this.parseInstructionLine(trimmedLine));
            }

            idx += 1;
        }

        return this.resolveLabels(parsedProgram);
    }

    trimComments(line) {
        let tokens = line.split("#");
        return tokens[0];
    }

    parseInstructionLine(line) {
        let tokens = line.split(" ").map(token => token.trim()).filter((token) => token.length > 0);

        let label = this.extractLabel(tokens);
        let type = this.extractType(tokens);

        for (let idx in tokens) {
            if (tokens[idx].endsWith(",")) {
                tokens[idx] = tokens[idx].substring(0, tokens[idx].length - 1).trim();
            }
        }

        let inst = this.instructionFactory.createFromMnemonic(type, tokens);
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
