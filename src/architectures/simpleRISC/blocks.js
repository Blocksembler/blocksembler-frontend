import * as Blockly from "blockly";

const instructionColor = 50;
const primitiveColor = 200;
const startStopColor = 0;
const labelColor = 255;

export const setupBlocklyBlocks = () => {
    Blockly.Blocks['start'] = {
        init: function () {
            this.appendDummyInput('start')
                .appendField('ENTRYPOINT');
            this.setInputsInline(true)
            this.setPreviousStatement(false);
            this.setNextStatement(true, null);
            this.setTooltip('Entry point of the program');
            this.setColour(startStopColor);
        }
    };

    Blockly.Blocks['labelDef'] = {
        init: function () {
            this.appendDummyInput('label text')
                .appendField('label: @')
                .appendField(new Blockly.FieldTextInput('default'), 'label');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('This block defines a label that is attached to the subsequent instruction block.');
            this.setColour(labelColor);
        }
    };

    Blockly.Blocks['label'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Label: >")
                .appendField(new Blockly.FieldTextInput("default"), "value");
            this.setInputsInline(true);
            this.setOutput(true, "label");
            this.setColour(labelColor);
            this.setTooltip("This block refers to an address defined by a label. Ensure the label is defined elsewhere!");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['immediate'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("decimal value: ")
                .appendField(new Blockly.FieldNumber(0, 0, 255), "value");
            this.setInputsInline(true);
            this.setOutput(true, "immediate");
            this.setColour(primitiveColor);
        }
    };

    Blockly.Blocks['register'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Register")
                .appendField(new Blockly.FieldNumber(0, 0, 15), "value");
            this.setInputsInline(true);
            this.setOutput(true, "register");
            this.setColour(primitiveColor);
        }
    };

    Blockly.Blocks['noop'] = {
        init: function () {
            this.appendDummyInput('label')
                .appendField('do nothing');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['load'] = {
        init: function () {
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
                .appendField('load value from ')
            this.appendDummyInput()
                .appendField("to ACC register")
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['move'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('move value of ACC to ')
            this.appendValueInput('operand')
                .setCheck(['register'])
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['add'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('add value of ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
                .appendField("to ACC register")
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);

        }
    }

    Blockly.Blocks['sub'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('subtract value of ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
                .appendField("from ACC register")
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['and'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('do logical AND of $ACC and ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.appendDummyInput()
                .appendField('and store result to $ACC')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['or'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('do logical OR of $ACC and ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.appendDummyInput()
                .appendField('and store result to $ACC')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['xor'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('do logical XOR of $ACC and ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.appendDummyInput()
                .appendField('and store result to $ACC')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['not'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('invert bits of $ACC')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['lshift'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('shift bits of $ACC to the left by ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['rshift'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('shift bits of $ACC to the right by ')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['compare'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('compare $ACC and')
            this.appendValueInput('operand')
                .setCheck(['register', 'immediate'])
            this.appendDummyInput()
                .appendField('and set STATUS flags')
            this.setTooltip('If $ACC is equal to the passed operand, the STATUS_EQ flag is set to 1 and if $ACC is greater than the passed operand the STATUS_GT flag is set to 1.');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }


    Blockly.Blocks['jump'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('jump to label')
            this.appendValueInput('label')
                .setCheck('label')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['beq'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('jump to label')
            this.appendValueInput('label')
                .setCheck('label')
            this.appendDummyInput()
                .appendField('if STATUS_EQ flag is set.')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['bgt'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('jump to label')
            this.appendValueInput('label')
                .setCheck('label')
            this.appendDummyInput()
                .appendField('if STATUS_GT flag is set.')
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(instructionColor);
        }
    }

    Blockly.Blocks['halt'] = {
        init: function () {
            this.appendDummyInput('label')
                .appendField('terminate the program');
            this.setInputsInline(true);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(startStopColor);
        }
    }
}