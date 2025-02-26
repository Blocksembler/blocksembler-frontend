import * as Blockly from "blockly";

const instructionColor = 50;
const primitiveColor = 200;
const startStopColor = 0;

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

    Blockly.Blocks['decImmediate'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("decimal value: ")
                .appendField(new Blockly.FieldNumber(0, 0, 63), "value");
            this.setInputsInline(true);
            this.setOutput(true, "immediate");
            this.setColour(primitiveColor);
        }
    };

    Blockly.Blocks['register'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("R")
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
                .setCheck('register')
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
                .setCheck('register')
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
                .setCheck('register')
                .appendField("from ACC register")
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