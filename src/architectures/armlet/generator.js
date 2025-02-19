import {BaseBlocklyGenerator, Order} from "@/architectures/generator.js";

const handleComments = (block) => {
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

        this.generator.forBlock["start"] = (block, _generator) => {
            return handleComments(block);
        };

        this.generator.forBlock["labelDef"] = (block, _generator) => {
            const label = block.getFieldValue("label");
            return `@${label}:` + handleComments(block);
        };

        this.generator.forBlock["register"] = (block, _generator) => {
            const registerNr = block.getFieldValue("value");

            return [`$${registerNr}`, Order.ATOMIC];
        };

        this.generator.forBlock["label"] = (block, _generator) => {
            const label = block.getFieldValue("value");

            return [`>${label}`, Order.ATOMIC];
        };

        this.generator.forBlock["decImmediate"] = (block, _generator) => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["hexImmediate"] = (block, _generator) => {
            const immediate = block.getFieldValue("value");

            return [`${immediate}`, Order.ATOMIC];
        };

        this.generator.forBlock["nop"] = (block, _generator) => {
            return `nop` + handleComments(block);
        }

        this.generator.forBlock["hlt"] = (block, _generator) => {
            return `hlt` + handleComments(block);
        }

        this.generator.forBlock["trp"] = (block, _generator) => {
            return `trp` + handleComments(block);
        }

        this.generator.forBlock["mov"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `mov ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["linst"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            const op = block.getFieldValue('operation')

            return `${op} ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["not"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);


            return `not ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["ainst"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            const op = block.getFieldValue('operation')

            return `${op} ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["neg"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `neg ${l}, ${a}` + handleComments(block);
        }

        this.generator.forBlock["lsl"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `lsl ${l}, ${a}, ${b}` + handleComments(block);
        }

        this.generator.forBlock["lsr"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `lsr ${l}, ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["asr"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `asr ${l}, ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["cmp"] = (block, _generator) => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const b = this.generator.valueToCode(block, "B", Order.ATOMIC);

            return `cmp ${a}, ${b} ` + handleComments(block);
        }

        this.generator.forBlock["jmp"] = (block, _generator) => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `jmp ${a} ` + handleComments(block);
        }

        this.generator.forBlock["cjmp"] = (block, _generator) => {
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);
            const op = block.getField("condition").getValue();

            return `${op} ${a} ` + handleComments(block);
        }


        this.generator.forBlock["loa"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `loa ${l}, ${a} ` + handleComments(block);
        }

        this.generator.forBlock["sto"] = (block, _generator) => {
            const l = this.generator.valueToCode(block, "L", Order.ATOMIC);
            const a = this.generator.valueToCode(block, "A", Order.ATOMIC);

            return `sto ${l}, ${a} ` + handleComments(block);
        }

        this.generator.forBlock['data'] = (block, _generator) => {
            let code = "%data ";

            let child = block.getChildren(true);

            if (child) {
                child = child[0];
            } else {
                child = null;
            }

            while (child) {
                let val = child.getFieldValue('data')
                code += `${val}, `;
                child = child.getNextBlock();
            }

            return code.slice(0, code.length - 2);
        }

        this.generator.forBlock['decimalWord'] = (block, _generator) => {
            const dataVal = block.getFieldValue("data");

            return `%data ${dataVal}`;
        }

        this.generator.forBlock['randPerm'] = (block, _generator) => {
            const n = block.getFieldValue("n");
            const seed = block.getFieldValue("seed");

            return `%randperm ${seed}, ${n}`;
        }

        this.generator.forBlock['rand'] = (block, _generator) => {
            const n = block.getFieldValue("n");
            const seed = block.getFieldValue("seed");

            return `%rand ${n}, ${seed}`;
        }
    }
}