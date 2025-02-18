import * as Blockly from "blockly";

export class BaseBlocklyGenerator {
    constructor(name) {
        this.generator = new Blockly.Generator(name);
        this.setupGenerator()
    }

    setupGenerator() {
        this.generator.forBlock["comment"] = function (block, _generator) {
            const commentText = block.getFieldValue('text');
            let source = "\n"

            for (let line of commentText.split("\n")) {
                source += ` # ${line} \n`;
            }
            return source
        }

        this.generator.scrub_ = (block, code, thisOnly) => {
            const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

            if (block.parentBlock_ === null && block.type !== "start") {
                return null;
            }

            if (nextBlock && !thisOnly) {
                if (code.length === 0) {
                    return `${code}${this.generator.blockToCode(nextBlock)}`;
                }
                return `${code}\n${this.generator.blockToCode(nextBlock)}`;
            }

            return code;
        };

    }
}