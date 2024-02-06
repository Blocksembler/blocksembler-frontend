import * as Blockly from "blockly";

export const annaGenerator = new Blockly.Generator("ANNA");

const Order = {
  ATOMIC: 0,
};

annaGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

  if (block.parentBlock_ == null && block.type !== "start") {
    return null;
  }

  if (nextBlock && !thisOnly) {
    if (code.length == 0) {
      return `${code}${annaGenerator.blockToCode(nextBlock)}`;
    }
    return `${code}\n${annaGenerator.blockToCode(nextBlock)}`;
  }

  return code;
};

annaGenerator.forBlock["add"] = function (block, generator) {
  var value_rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
  var value_rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var code = `add ${value_rd} ${value_rs1} ${value_rs2}`;
  return code;
};

annaGenerator.forBlock["register"] = function (block, generator) {
  var number_registernr = block.getFieldValue("registerNr");

  var code = `r${number_registernr}`;

  return [code, Order.ATOMIC];
};

annaGenerator.forBlock["addi"] = function (block, generator) {
  var value_rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
  var number_immediate = block.getFieldValue("immediate");
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var code = `addi ${value_rd} ${value_rs1} ${number_immediate}`;
  return code;
};

annaGenerator.forBlock["sub"] = function (block, generator) {
  var value_rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
  var value_rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var code = `sub ${value_rd} ${value_rs1} ${value_rs2}`;
  return code;
};

annaGenerator.forBlock["lli"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var number_immediate = block.getFieldValue("immediate");
  var code = `lli ${value_rd} ${number_immediate}`;
  return code;
};

annaGenerator.forBlock["lui"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var number_immediate = block.getFieldValue("immediate");
  var code = `lui ${value_rd} ${number_immediate}`;
  return code;
};

annaGenerator.forBlock["and"] = function (block, generator) {
  var value_rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
  var value_rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var code = `and ${value_rd} ${value_rs1} ${value_rs2}`;
  return code;
};

annaGenerator.forBlock["or"] = function (block, generator) {
  var value_rs1 = generator.valueToCode(block, "rs1", Order.ATOMIC);
  var value_rs2 = generator.valueToCode(block, "rs2", Order.ATOMIC);
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var code = `or ${value_rd} ${value_rs1} ${value_rs2}`;
  return code;
};

annaGenerator.forBlock["not"] = function (block, generator) {
  var value_rs = generator.valueToCode(block, "rs", Order.ATOMIC);
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var code = `not ${value_rd} ${value_rs}`;
  return code;
};

annaGenerator.forBlock["shf"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var value_rs = generator.valueToCode(block, "rs", Order.ATOMIC);
  var number_immediate = block.getFieldValue("immediate");
  // TODO: Assemble javascript into code variable.
  var code = `shf ${value_rd} ${value_rs} ${number_immediate}`;
  return code;
};

annaGenerator.forBlock["lw"] = function (block, generator) {
  var value_rs = generator.valueToCode(block, "rs", Order.ATOMIC);
  var number_offset = block.getFieldValue("offset");
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var code = `lw ${value_rd} ${value_rs} ${number_offset}`;
  return code;
};

annaGenerator.forBlock["sw"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var value_rs = generator.valueToCode(block, "rs", Order.ATOMIC);
  var number_offset = block.getFieldValue("offset");
  var code = `sw ${value_rd} ${value_rs} ${number_offset}`;
  return code;
};

annaGenerator.forBlock["in"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var code = `in ${value_rd}`;
  return code;
};

annaGenerator.forBlock["out"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var code = `out ${value_rd}`;
  return code;
};

annaGenerator.forBlock["bez"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var value_label = generator.valueToCode(block, "Label", Order.ATOMIC);

  var code = `bez ${value_rd} ${value_label}`;
  return code;
};

annaGenerator.forBlock["bgz"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);
  var value_label = generator.valueToCode(block, "label", Order.ATOMIC);

  var code = `bgz ${value_rd} ${value_label}`;
  return code;
};

annaGenerator.forBlock["jalr"] = function (block, generator) {
  var value_rd = generator.valueToCode(block, "rd", Order.ATOMIC);

  var value_rs = generator.valueToCode(block, "rs", Order.ATOMIC);
  var code = `jalr ${value_rd} ${value_rs}`;
  return code;
};

annaGenerator.forBlock["halt"] = function (block, generator) {
  var code = ".halt";
  return code;
};

annaGenerator.forBlock["start"] = function (block, generator) {
  var code = "";
  return code;
};

const generateRegister = function (block, generator) {
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
  let valueLabel = generator.valueToCode(block, "label", Order.ATOMIC);

  let statements = generator.statementToCode(block, "statements");
  let code = `${valueLabel.slice(1)}: ${statements} \n`;

  return code;
};

annaGenerator.forBlock["labeldescriptor"] = function (block, generator) {
  var text_label_name = block.getFieldValue("label_name");
  return [`&${text_label_name}`, Order.ATOMIC];
};
