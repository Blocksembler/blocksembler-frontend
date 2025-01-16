import * as Blockly from "blockly";

export const generator = new Blockly.Generator("armlet");

const Order = {
    ATOMIC: 0,
};

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

generator.forBlock["start"] = function (_block, _generator) {
    return "";
};

generator.forBlock["label"] = function (block, _generator) {
    const label = block.getFieldValue("label");
    return `@${label}:`;
};

generator.forBlock["register"] = function (block, _generator) {
    const registerNr = block.getFieldValue("register");

    return [`$${registerNr}`, Order.ATOMIC];
};

generator.forBlock["labelVal"] = function (block, _generator) {
    const label = block.getFieldValue("label");

    return [`>${label}`, Order.ATOMIC];
};

generator.forBlock["immediate"] = function (block, _generator) {
    const immediate = block.getFieldValue("immediate");

    return [`${immediate}`, Order.ATOMIC];
};

generator.forBlock["nop"] = function (block, _generator) {
    return `nop`;
}

generator.forBlock["hlt"] = function (block, _generator) {
    return `hlt`;
}

generator.forBlock["trp"] = function (block, _generator) {
    return `trp`;
}

generator.forBlock["mov"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `mov ${l}, ${a}`;
}

generator.forBlock["and"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `and ${l}, ${a}, ${b}`;
}

generator.forBlock["ior"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `ior ${l}, ${a}, ${b}`;
}

generator.forBlock["eor"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `eor ${l}, ${a}, ${b}`;
}

generator.forBlock["not"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);


    return `not ${l}, ${a}`;
}

generator.forBlock["add"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `add ${l}, ${a}, ${b}`;
}

generator.forBlock["sub"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `sub ${l}, ${a}, ${b}`;
}

generator.forBlock["neg"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `neg ${l}, ${a}`;
}

generator.forBlock["lsl"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `lsl ${l}, ${a}, ${b}`;
}

generator.forBlock["lsr"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `lsr ${l}, ${a}, ${b}`;
}

generator.forBlock["asr"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `asr ${l}, ${a}, ${b}`;
}

generator.forBlock["cmp"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);
    const b = generator.valueToCode(block, "B", Order.ATOMIC);

    return `cmp ${a}, ${b}`;
}

generator.forBlock["jmp"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `jmp ${a}`;
}

generator.forBlock["beq"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `beq ${a}`;
}

generator.forBlock["bne"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bne ${a}`;
}

generator.forBlock["bgt"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bgt ${a}`;
}

generator.forBlock["bge"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bge ${a}`;
}

generator.forBlock["blt"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `blt ${a}`;
}

generator.forBlock["ble"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `ble ${a}`;
}

generator.forBlock["bab"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bab ${a}`;
}

generator.forBlock["bbw"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a}`;
}

generator.forBlock["bae"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a}`;
}

generator.forBlock["bbe"] = function (block, _generator) {
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `bbw ${a}`;
}

generator.forBlock["loa"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `loa ${l}, ${a}`;
}

generator.forBlock["sto"] = function (block, _generator) {
    const l = generator.valueToCode(block, "L", Order.ATOMIC);
    const a = generator.valueToCode(block, "A", Order.ATOMIC);

    return `sto ${l}, ${a}`;
}