import * as Blockly from "blockly";

export const Order = {
    ATOMIC: 0,
};

export class BaseBlocklyGenerator {
    generator: Blockly.Generator;

    constructor(name: string) {
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

        this.generator.scrub_ = (block: Blockly.Block, code: string, thisOnly: boolean): string => {
            const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

            if (block.getParent() === null && block.type !== "start") {
                return "";
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
