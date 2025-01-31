import * as Blockly from "blockly";
import {FieldMultilineInput} from "@blockly/field-multilineinput";

const atomicValueColor = 350;
const operationColor = 200;
const jmpColor = 50;
const cmpColor = 150;
const dataWordColor = 0;

Blockly.Blocks['start'] = {
    init: function () {
        this.appendDummyInput('start')
            .appendField('START');
        this.setInputsInline(true)
        this.setPreviousStatement(false);
        this.setNextStatement(true, null);
        this.setTooltip('nop instruction');
        this.setHelpUrl('');
        this.setColour(0);
    }
};

Blockly.Blocks['comment'] = {
    init: function () {
        this.appendDummyInput('label text')
            .appendField(new FieldMultilineInput('This is a multi-\nline comment!'), 'text');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('mov instruction');
        this.setHelpUrl('');
        this.setColour(60);
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
        this.setTooltip('mov instruction');
        this.setHelpUrl('');
        this.setColour(225);
    }
};

Blockly.Blocks['immediate'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Immediate: ")
            .appendField(new Blockly.FieldNumber(0), "value");
        this.setInputsInline(true);
        this.setOutput(true, "immediate");
        this.setColour(atomicValueColor);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['register'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Register: $")
            .appendField(new Blockly.FieldNumber(0, 0, 7), "value");
        this.setInputsInline(true);
        this.setOutput(true, "register");
        this.setColour(atomicValueColor);
        this.setTooltip("register");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['label'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Label: >")
            .appendField(new Blockly.FieldTextInput("default"), "value");
        this.setInputsInline(true);
        this.setOutput(true, "label");
        this.setColour(atomicValueColor);
        this.setTooltip("register");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['nop'] = {
    init: function () {
        this.appendDummyInput('nop Text')
            .appendField('do nothing');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('nop instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['hlt'] = {
    init: function () {
        this.appendDummyInput('hlt Text')
            .appendField('terminate program');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('hlt instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['trp'] = {
    init: function () {
        this.appendDummyInput('trp Text')
            .appendField('pause program execution');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('trp instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};


Blockly.Blocks['mov'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('move value');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('to register');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('mov instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['not'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate'])
            .appendField('invert bits of ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('and store result to ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('not instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['neg'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate'])
            .appendField('negate the value of ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('and store result to ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('neg instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['loa'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('load the value that is stored in memory at address ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('to register ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('neg instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['sto'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('store the value of register ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('to memory at address ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('neg instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};


Blockly.Blocks['and'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do bitwise AND of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField('and');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('then store result to');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('and instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['ior'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do bitwise (inclusive) OR of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField('and');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('then store result to');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('ior instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['eor'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do bitwise exclusive OR of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField('and');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('then store result to');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('eor instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['add'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('calculate ');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' + ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('and store result to');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('add instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['sub'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('calculate ');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' - ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('and store result to');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('sub instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['lsl'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do a logic shift to the left (<<) of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' by ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('bit positions and store result to ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('lsl instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['lsr'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do a logic shift to the right (>>) of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' by ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('bit positions and store result to ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('lsr instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['asr'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('do a arithmetic shift to the right (>>) of');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' by ');
        this.appendValueInput('L')
            .setCheck('register')
            .appendField('bit positions and store result to ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('asr instruction');
        this.setHelpUrl('');
        this.setColour(operationColor);
    }
};

Blockly.Blocks['cmp'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck('register')
            .appendField('compare');
        this.appendValueInput('B')
            .setCheck(['register', 'immediate'])
            .appendField(' and ');
        this.appendDummyInput()
            .appendField(' and update status register');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('cmp instruction');
        this.setHelpUrl('');
        this.setColour(cmpColor);
    }
};

Blockly.Blocks['jmp'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('jmp instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['beq'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was equal');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('beq instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bne'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was not equal');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bne instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bgt'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison greater than');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bgt instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['blt'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison less than');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('blt instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bge'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison greater or equal');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bge instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['ble'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison less or equal');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('ble instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bab'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was above');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bab instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bbw'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was below');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bbw instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bae'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was above or equal');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bae instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['bbe'] = {
    init: function () {
        this.appendValueInput('A')
            .setCheck(['register', 'immediate', 'label'])
            .appendField('jump to address ');
        this.appendDummyInput()
            .appendField('if last comparison was below or equal');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bbe instruction');
        this.setHelpUrl('');
        this.setColour(jmpColor);
    }
};

Blockly.Blocks['data'] = {
    init: function () {
        this.appendDummyInput('test')
            .setAlign(Blockly.inputs.Align.CENTRE)
            .appendField('Declare multiple words of data:');
        this.appendStatementInput('dataWords')
            .setCheck('dataWord');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('mov instruction');
        this.setHelpUrl('');
        this.setColour(dataWordColor);
    }
};

Blockly.Blocks['decimalWord'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Decimal Word")
            .appendField(new Blockly.FieldNumber(0), "data");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('bbe instruction');
        this.setHelpUrl('');
        this.setColour(dataWordColor);
        this.setOutput(false, "dataWord");
    }
};
