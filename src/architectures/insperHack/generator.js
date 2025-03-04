export const generator = new Blockly.Generator("InsperHack");

generator.forBlock['addw'] = function() {
    const dropdown_position1 = block.getFieldValue('position1');
    const dropdown_position2 = block.getFieldValue('position2');
    const dropdown_position3 = block.getFieldValue('position3');
  
    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  }