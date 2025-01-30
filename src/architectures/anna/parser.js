export class AnnaAssemblyParser {
    constructor(factory) {
        this.instructionFactory = factory;
    }

    parseCode(code) {
        let lines = code.split("\n").map((line) => line.trim());
        let parsedProgram = [];

        lines.forEach((line) => {
            let trimmedLine = this.trimComments(line);
            if (trimmedLine) {
                parsedProgram.push(this.parseInstructionLine(trimmedLine));
            }
        });

        return parsedProgram;
    }

    trimComments(line) {
        let tokens = line.split("#");
        return tokens[0];
    }

    parseInstructionLine(line) {
        let tokens = line.split(" ").map(token => token.trim()).filter((token) => token.length > 0);

        let label = this.extractLabel(tokens);
        let type = this.extractType(tokens);

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

        program.forEach((instruction, address) => {
            if (instruction.label) {
                labelAddresses[instruction.label] = address;
            }
        });

        program.forEach((instruction, address) => {
            const relAddressingInstructions = ["bgz", "bez", "jalr"];
            const absAddressingInstructions = ["lli", "lui"];
            const instructionMnemonic = instruction.constructor.mnemonic;

            for (let idx in instruction.args) {
                let args = instruction.args;
                if (args[idx][0] === "&") {
                    if (relAddressingInstructions.includes(instructionMnemonic)) {
                        args[idx] = labelAddresses[args[idx].slice(1)] - address - 1;
                    } else if (absAddressingInstructions.includes(instructionMnemonic)) {
                        args[idx] = labelAddresses[args[idx].slice(1)];
                    }
                }
            }
        });

        return program;
    }
}
