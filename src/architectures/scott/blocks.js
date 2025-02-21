import * as Blockly from "blockly";

const atomicValueColor = 350;
const operationColor = 200;

export const setupBlocklyBlocks = () => {
    Blockly.Blocks['start'] = {
        init: function () {
            this.appendDummyInput('start')
                .appendField('ENTRYPOINT (Address: 0x32)');
            this.setInputsInline(true)
            this.setPreviousStatement(false);
            this.setNextStatement(true, null);
            this.setTooltip('Entry point of the program');
            this.setColour(0);
        }
    };

    Blockly.Blocks['labelDef'] = {
        init: function () {
            this.appendDummyInput('label text')
                .appendField('label: .')
                .appendField(new Blockly.FieldTextInput('default'), 'label');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('This block defines a label that is attached to the subsequent instruction block.');
            this.setColour(225);
        }
    };

    Blockly.Blocks['decImmediate'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("decimal value: ")
                .appendField(new Blockly.FieldNumber(0, 0, 255), "value");
            this.setInputsInline(true);
            this.setOutput(true, "immediate");
            this.setColour(atomicValueColor);
            this.setTooltip("This block represents an immediate integer value.");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['label'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Label: .")
                .appendField(new Blockly.FieldTextInput, "value");
            this.setInputsInline(true);
            this.setOutput(true, "label");
            this.setColour(atomicValueColor);
            this.setTooltip("This block represents an immediate integer value.");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['register'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("R")
                .appendField(new Blockly.FieldNumber(0, 0, 3), "value");
            this.setInputsInline(true);
            this.setOutput(true, "register");
            this.setColour(atomicValueColor);
            this.setTooltip("This block refers to one of the 4 registers (R0 - R3).");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['label'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Label: .")
                .appendField(new Blockly.FieldTextInput("default"), "value");
            this.setInputsInline(true);
            this.setOutput(true, "label");
            this.setColour(atomicValueColor);
            this.setTooltip("This block refers to an address defined by a label. Ensure the label is defined elsewhere!");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['add'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Add registers")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and');
            this.appendDummyInput()
                .appendField('and store the result into the latter.')
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Adds both registers and stores the result into the first.');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['shr'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Shift")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('by 1 to the right and store result to');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Shifts the first register by 1 to the right');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['shl'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Shift")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('by 1 to the left and store result to');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Shifts the first register by 1 to the right');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['not'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Invert Bits of Register")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and store result to');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Inverts the Bits of the first register and stores the result to the second register (e.g. "10101010" -> "010101012)');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['and'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Performs a bitwise AND on the values in")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and');
            this.appendDummyInput()
                .appendField("then stores the result in the second register");
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Inverts the Bits of the first register and stores the result to the second register (e.g. "10101010" -> "010101012)');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['or'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Performs a bitwise OR on the values in")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and');
            this.appendDummyInput()
                .appendField("then stores the result in the second register");
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Inverts the Bits of the first register and stores the result to the second register (e.g. "10101010" -> "010101012)');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['xor'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Performs a bitwise XOR on the values in")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and');
            this.appendDummyInput()
                .appendField("then stores the result in the second register");
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Inverts the Bits of the first register and stores the result to the second register (e.g. "10101010" -> "010101012)');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['jmp'] = {
        init: function () {
            this.appendValueInput('target')
                .setCheck(['label', 'immediate', 'register'])
                .appendField('Jump to ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, ['instruction', 'label']);
            this.setTooltip('mov instruction');
            this.setHelpUrl('');
            this.setColour(225);
        }
    }

    Blockly.Blocks['jcaez'] = {
        init: function () {
            this.appendValueInput('target')
                .setCheck(['label', 'immediate', 'register'])
                .appendField('Jump to ');
            this.appendDummyInput('test')
                .setAlign(Blockly.inputs.Align.CENTRE)
                .appendField('if on of following flags is set: c')
                .appendField(new Blockly.FieldCheckbox('TRUE'), 'C')
                .appendField(', a')
                .appendField(new Blockly.FieldCheckbox('TRUE'), 'A')
                .appendField(', e')
                .appendField(new Blockly.FieldCheckbox('TRUE'), 'E')
                .appendField(', z')
                .appendField(new Blockly.FieldCheckbox('TRUE'), 'Z');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, ['instruction', 'label']);
            this.setTooltip('mov instruction');
            this.setHelpUrl('');
            this.setColour(225);
        }
    }

    Blockly.Blocks['cmp'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("Compare register ")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField('and');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Compares two registers and sets the according flags.');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['data'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Store value ")
                .appendField(new Blockly.FieldNumber(0, 0, 255), "immediate")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField("into register")
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Compares two registers and sets the according flags.');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['ld'] = {
        init: function () {
            this.appendValueInput('RA')
                .setCheck('register')
                .appendField("load value from memory at address ")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField("into")
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Compares two registers and sets the according flags.');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['st'] = {
        init: function () {
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField("store value in ")
            this.appendValueInput('RB')
                .setCheck('register')
                .appendField("to memory at address ")
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Compares two registers and sets the according flags.');
            this.setColour(operationColor);
        }
    }

    Blockly.Blocks['clf'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Reset Flags")
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Reset all Flags (c, a, e, z) to 0.');
            this.setColour(operationColor);
        }
    }

};
