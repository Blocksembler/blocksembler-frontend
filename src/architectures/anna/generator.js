import * as Blockly from "blockly";

export const annaGenerator = new Blockly.Generator("ANNA");

const Order = {
    ATOMIC: 0,
};

annaGenerator.scrub_ = function (block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

    if (block.parentBlock_ === null && block.type !== "start") {
        return null;
    }

    if (nextBlock && !thisOnly) {
        if (code.length === 0) {
            return `${code}${annaGenerator.blockToCode(nextBlock)}`;
        }
        return `${code}\n${annaGenerator.blockToCode(nextBlock)}`;
    }

    return code;
};

annaGenerator.forBlock["add"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `add ${rd} ${rs1} ${rs2}`;
};

annaGenerator.forBlock["register"] = function (block, _generator) {
    const registerNr = block.getFieldValue("registerNr");

    return [`r${registerNr}`, Order.ATOMIC];
};

annaGenerator.forBlock["addi"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `addi ${rd} ${rs1} ${immediate}`;
};

annaGenerator.forBlock["sub"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `sub ${rd} ${rs1} ${rs2}`;
};

annaGenerator.forBlock["lli"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `lli ${rd} ${immediate}`;
};

annaGenerator.forBlock["lli_label"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `lli ${rd} ${label}`;
};

annaGenerator.forBlock["lui_label"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `lui ${rd} ${label}`;
};

annaGenerator.forBlock["lui"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `lui ${rd} ${immediate}`;
};

annaGenerator.forBlock["and"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `and ${rd} ${rs1} ${rs2}`;
};

annaGenerator.forBlock["or"] = function (block, generator) {
    const rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
    const rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `or ${rd} ${rs1} ${rs2}`;
};

annaGenerator.forBlock["not"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `not ${rd} ${rs}`;
};

annaGenerator.forBlock["shf"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const immediate = block.getFieldValue("immediate");

    return `shf ${rd} ${rs} ${immediate}`;
};

annaGenerator.forBlock["lw"] = function (block, generator) {
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const offset = block.getFieldValue("offset");
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `lw ${rd} ${rs} ${offset}`;
};

annaGenerator.forBlock["sw"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);
    const offset = block.getFieldValue("offset");
    return `sw ${rd} ${rs} ${offset}`;
};

annaGenerator.forBlock["in"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `in ${rd}`;
};

annaGenerator.forBlock["out"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);

    return `out ${rd}`;
};

annaGenerator.forBlock["bez"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `bez ${rd} ${label}`;
};

annaGenerator.forBlock["bgz"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const label = generator.valueToCode(block, "label", Order.ATOMIC);

    return `bgz ${rd} ${label}`;
};

annaGenerator.forBlock["jalr"] = function (block, generator) {
    const rd = generator.valueToCode(block, "rd", Order.ATOMIC);
    const rs = generator.valueToCode(block, "rs", Order.ATOMIC);

    return `jalr ${rd} ${rs}`;
};

annaGenerator.forBlock["halt"] = function (_block, _generator) {
    return ".halt";
};

annaGenerator.forBlock["start"] = function (_block, _generator) {
    return "";
};

const generateRegister = function (block, _generator) {
    return [block.type, Order.ATOMIC];
};

annaGenerator.forBlock["r0"] = generateRegister;
annaGenerator.forBlock["r1"] = generateRegister;
annaGenerator.forBlock["r2"] = generateRegister;
annaGenerator.forBlock["r3"] = generateRegister;
annaGenerator.forBlock["r4"] = generateRegister;
annaGenerator.forBlock["r5"] = generateRegister;
annaGenerator.forBlock["r6"] = generateRegister;
annaGenerator.forBlock["r7"] = generateRegister;

annaGenerator.forBlock["labelsection"] = function (block, generator) {
    let label = generator.valueToCode(block, "label", Order.ATOMIC);
    let statements = generator.statementToCode(block, "statements");

    return `${label.slice(1)}: ${statements} \n`;
};

annaGenerator.forBlock["labeldescriptor"] = function (block, _generator) {
    const labelName = block.getFieldValue("label_name");

    return [`&${labelName}`, Order.ATOMIC];
};
