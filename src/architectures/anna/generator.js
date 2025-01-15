import * as Blockly from "blockly";

export const generator = new Blockly.Generator("ANNA");

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

generator.forBlock["add"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `add ${rd} ${rs1} ${rs2}`;
};

generator.forBlock["register"] = function (block, _generator) {
    const registerNr = block.getFieldValue("registerNr");

    return [`r${registerNr}`, Order.ATOMIC];
};

generator.forBlock["addi"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `addi ${rd} ${rs1} ${immediate}`;
};

generator.forBlock["sub"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `sub ${rd} ${rs1} ${rs2}`;
};

generator.forBlock["lli"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `lli ${rd} ${immediate}`;
};

generator.forBlock["lli_label"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `lli ${rd} ${label}`;
};

generator.forBlock["lui_label"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `lui ${rd} ${label}`;
};

generator.forBlock["lui"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `lui ${rd} ${immediate}`;
};

generator.forBlock["and"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `and ${rd} ${rs1} ${rs2}`;
};

generator.forBlock["or"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `or ${rd} ${rs1} ${rs2}`;
};

generator.forBlock["not"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `not ${rd} ${rs}`;
};

generator.forBlock["shf"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `shf ${rd} ${rs} ${immediate}`;
};

generator.forBlock["lw"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const offset = block.getFieldValue("offset");
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `lw ${rd} ${rs} ${offset}`;
};

generator.forBlock["sw"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const offset = block.getFieldValue("offset");
    return `sw ${rd} ${rs} ${offset}`;
};

generator.forBlock["in"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `in ${rd}`;
};

generator.forBlock["out"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `out ${rd}`;
};

generator.forBlock["bez"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `bez ${rd} ${label}`;
};

generator.forBlock["bgz"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `bgz ${rd} ${label}`;
};

generator.forBlock["jalr"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);

    return `jalr ${rd} ${rs}`;
};

generator.forBlock["halt"] = function (_block, _generator) {
    return ".halt";
};

generator.forBlock["start"] = function (_block, _generator) {
    return "";
};

const generateRegister = function (block, _generator) {
    return [block.type, Order.ATOMIC];
};

generator.forBlock["r0"] = generateRegister;
generator.forBlock["r1"] = generateRegister;
generator.forBlock["r2"] = generateRegister;
generator.forBlock["r3"] = generateRegister;
generator.forBlock["r4"] = generateRegister;
generator.forBlock["r5"] = generateRegister;
generator.forBlock["r6"] = generateRegister;
generator.forBlock["r7"] = generateRegister;

generator.forBlock["labelsection"] = function (block, generator) {
    let label = generator.valueToCode(block, "label", Order.ATOMIC);
    let statements = generator.statementToCode(block, "statements");

    return `${label.slice(1)}: ${statements} \n`;
};

generator.forBlock["labeldescriptor"] = function (block, _generator) {
    const labelName = block.getFieldValue("label_name");

    return [`&${labelName}`, Order.ATOMIC];
};
