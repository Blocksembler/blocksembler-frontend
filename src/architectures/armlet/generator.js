import * as Blockly from "blockly";

export const generator = new Blockly.Generator("armlet");

const Order = {
    ATOMIC: 0,
};

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

generator.scrub_ = function (block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

    if (block.parentBlock_ === null && block.type !== "start") {
        return null;
    }

    if (nextBlock && !thisOnly) {
        if (code.length === 0) {
            return `${code}${generator.blockToCode(nextBlock)}`;
        }
        return `${code}\n${generator.blockToCode(nextBlock)}`;
    }

    return code;
};

generator.forBlock["start"] = function (block, _generator) {
    return handleComments(block);
};

generator.forBlock["labelDef"] = function (block, _generator) {
    const label = block.getFieldValue("label");
    return `@${label}:` + handleComments(block);
};

generator.forBlock["register"] = function (block, _generator) {
    const registerNr = block.getFieldValue("value");

    return [`$${registerNr}`, Order.ATOMIC];
};

generator.forBlock["label"] = function (block, _generator) {
    const label = block.getFieldValue("value");

    return [`>${label}`, Order.ATOMIC];
};

generator.forBlock["immediate"] = function (block, _generator) {
    const immediate = block.getFieldValue("value");

    return [`${immediate}`, Order.ATOMIC];
};

generator.forBlock["nop"] = function (block, _generator) {
    return `nop` + handleComments(block);
}

generator.forBlock["hlt"] = function (block, _generator) {
    return `hlt` + handleComments(block);
}

generator.forBlock["trp"] = function (block, _generator) {
    return `trp` + handleComments(block);
}

generator.forBlock["mov"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `mov ${l}, ${a}` + handleComments(block);
}

generator.forBlock["and"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `and ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["ior"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `ior ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["eor"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `eor ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["not"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);


    return `not ${l}, ${a}` + handleComments(block);
}

generator.forBlock["add"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `add ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["sub"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `sub ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["neg"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `neg ${l}, ${a}` + handleComments(block);
}

generator.forBlock["lsl"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `lsl ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["lsr"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `lsr ${l}, ${a}, ${b} ` + handleComments(block);
}

generator.forBlock["asr"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `asr ${l}, ${a}, ${b} ` + handleComments(block);
}

generator.forBlock["cmp"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `cmp ${a}, ${b} ` + handleComments(block);
}

generator.forBlock["jmp"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `jmp ${a} ` + handleComments(block);
}

generator.forBlock["beq"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `beq ${a} ` + handleComments(block);
}

generator.forBlock["bne"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bne ${a} ` + handleComments(block);
}

generator.forBlock["bgt"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bgt ${a} ` + handleComments(block);
}

generator.forBlock["bge"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bge ${a} ` + handleComments(block);
}

generator.forBlock["blt"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `blt ${a} ` + handleComments(block);
}

generator.forBlock["ble"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `ble ${a} ` + handleComments(block);
}

generator.forBlock["bab"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bab ${a} ` + handleComments(block);
}

generator.forBlock["bbw"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a} ` + handleComments(block);
}

generator.forBlock["bae"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a} ` + handleComments(block);
}

generator.forBlock["bbe"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a} ` + handleComments(block);
}

generator.forBlock["loa"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `loa ${l}, ${a} ` + handleComments(block);
}

generator.forBlock["sto"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `sto ${l}, ${a} ` + handleComments(block);
}

generator.forBlock['data'] = function (block, _generator) {
    const dataVal = block.getFieldValue("wordData");

    return `%data ${dataVal}`;
}