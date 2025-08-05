import {BaseBlocklyGenerator, Order} from "@/architectures/generator";
import {Block, CodeGenerator} from "blockly";

const handleComments = (block: Block): string => {
    let comment = block.getCommentText()
    let commentText = ""

    if (!comment) {
        return "";
    }

    for (let line of comment.split('\n')) {
        commentText += ` # ${line} \n`;
    }

    return commentText.slice(0, commentText.length - 1);
}

export class ArmletBlocklyGenerator extends BaseBlocklyGenerator {
    constructor() {
        super("armlet");
    }

    setupGenerator() {
        super.setupGenerator();

        this.generator.forBlock["start"] = (block: Block, _generator: CodeGenerator): string => {
            return handleComments(block);
        };

        this.generator.forBlock["labelDef"] = (block: Block, _generator: CodeGenerator): string => {
            const label = block.getFieldValue("label");
            return `@${label}:` + handleComments(block);
        };

        this.generator.forBlock["register"] = (block: Block, _generator: CodeGenerator): [string, number] => {
            const registerNr = block.getFieldValue("value");

            return [`$${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["label"] = (block: Block, _generator: CodeGenerator): [string, number] => {
            const label = block.getFieldValue("value");

            return [`>${label}`, Order.ATOMIC];
        };

        this.generator.forBlock["decImmediate"] = (block: Block, _generator: CodeGenerator): [string, number] => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["signedDecImmediate"] = (block: Block, _generator: CodeGenerator): [string, number] => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["hexImmediate"] = (block: Block, _generator: CodeGenerator): [string, number] => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["nop"] = (block: Block, _generator: CodeGenerator): string => {
            return `nop` + handleComments(block);
        }

        this.generator.forBlock["hlt"] = (block: Block, _generator: CodeGenerator): string => {
            return `hlt` + handleComments(block);
        }

        this.generator.forBlock["trp"] = (block: Block, _generator: CodeGenerator): string => {
            return `trp` + handleComments(block);
        }

        this.generator.forBlock["mov"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `mov ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["linst"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            const op = block.getFieldValue('operation')

            return `${op} ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["not"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);


            return `not ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["ainst"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            const op = block.getFieldValue('operation')

            return `${op} ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["neg"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `neg ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["lsl"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `lsl ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["lsr"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `lsr ${l}, ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["asr"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `asr ${l}, ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["cmp"] = (block: Block, _generator: CodeGenerator): string => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `cmp ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["jmp"] = (block: Block, _generator: CodeGenerator): string => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `jmp ${a} ` + handleComments(block);
        }

        this.generator.forBlock["cjmp"] = (block: Block, _generator: CodeGenerator): string => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const op = block.getField("condition")?.getValue();

            return `${op} ${a} ` + handleComments(block);
        }


        this.generator.forBlock["loa"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `loa ${l}, ${a} ` + handleComments(block);
        }

        this.generator.forBlock["sto"] = (block: Block, _generator: CodeGenerator): string => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `sto ${l}, ${a} ` + handleComments(block);
        }

        this.generator.forBlock['data'] = (block: Block, _generator: CodeGenerator) => {
            let code: string = "%data ";
            let comment: string = handleComments(block)

            let child: Array<Block> = block.getChildren(true);
            let current: Block | null = null;

            if (child) {
                current = child[0];
            }

            while (current) {
                let val = current.getFieldValue('data')
                code += `${val}, `;

                if (current.getCommentText()) {
                    if (comment === "") {
                        comment = "# " + current.getCommentText()
                    } else {
                        comment = comment + ", " + current.getCommentText()
                    }
                }

                current = current.getNextBlock();
            }

            return code.slice(0, code.length - 2) + comment;
        }

        this.generator.forBlock['decimalWord'] = (block: Block, _generator: CodeGenerator): string => {
            const dataVal = block.getFieldValue("data");

            return `%data ${dataVal}` + handleComments(block);
        }

        this.generator.forBlock['randPerm'] = (block: Block, _generator: CodeGenerator): string => {
            const n = block.getFieldValue("n");
            const seed = block.getFieldValue("seed");

            return `%randperm ${seed}, ${n}` + handleComments(block);
        }

        this.generator.forBlock['rand'] = (block: Block, _generator: CodeGenerator): string => {
            const n = block.getFieldValue("n");
            const seed = block.getFieldValue("seed");

            return `%rand ${n}, ${seed}` + handleComments(block);
        }
    }
}