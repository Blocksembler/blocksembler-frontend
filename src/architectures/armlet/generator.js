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

generator.forBlock["comment"] = function (block, _generator) {
    const commentText = block.getFieldValue('text');
    let source = "\n"

    for (let line of commentText.split("\n")) {
        source += ` # ${line} \n`;
    }
    return source
}

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

generator.forBlock["linst"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    const op = block.getFieldValue('operation')

    return `${op} ${l}, ${a}, ${b}` + handleComments(block);
}

generator.forBlock["not"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);


    return `not ${l}, ${a}` + handleComments(block);
}

generator.forBlock["ainst"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    const op = block.getFieldValue('operation')

    return `${op} ${l}, ${a}, ${b}` + handleComments(block);
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

generator.forBlock["cjmp"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const op = block.getField("condition").getValue();

    return `${op} ${a} ` + handleComments(block);
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

generator.forBlock['decimalWord'] = function (block, _generator) {
    const dataVal = block.getFieldValue("data");

    return `%data ${dataVal}`;
}