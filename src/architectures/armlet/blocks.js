import * as Blockly from "blockly";

const atomicValueColor = 350;
const operationColor = 200;
const jmpColor = 50;
const cmpColor = 150;
const dataWordColor = 0;


export const setupBlocklyBlocks = () => {
    Blockly.Blocks['start'] = {
        init: function () {
            this.appendDummyInput('start')
                .appendField('ENTRYPOINT');
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
                .appendField('label: @')
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
                .appendField(new Blockly.FieldNumber(0, 0, 65535), "value");
            this.setInputsInline(true);
            this.setOutput(true, "immediate");
            this.setColour(atomicValueColor);
            this.setTooltip("This block represents an immediate integer value.");
            this.setHelpUrl("");
        }
    };

    const validateHex = (val) => {
        if (val.startsWith("0x")) {
            val = val.slice(2);
        }

        val = val.padStart(4, "0");

        if (!/^[0-9a-fA-F]{4}$/i.test(val)) {
            val = '0000'
        }

        return `0x${val}`
    }

    Blockly.Blocks['hexImmediate'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("hex value: ")
                .appendField(new Blockly.FieldTextInput("0x0000", validateHex), "value");
            this.setInputsInline(true);
            this.setOutput(true, "immediate");
            this.setColour(atomicValueColor);
            this.setTooltip("This block represents an immediate integer value.");
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
            this.setTooltip("This block refers to one of the 8 registers ($0 - $7).");
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
            this.setTooltip("This block refers to an address defined by a label. Ensure the label is defined elsewhere!");
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
            this.setTooltip('This instruction does nothing.');
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
            this.setTooltip('Halts the program execution.');
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
            this.setTooltip('Triggers a trap (interrupt) in the program.');
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
            this.setTooltip('Copies a value (register/immediate/label) into a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['not'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('= bit-wise not');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a bitwise NOT on a value and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['neg'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField(':= negative value of');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Takes the two’s complement (negation) of a value and stores it in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['loa'] = {
        init: function () {
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('load the value stored in memory at address ');
            this.appendValueInput('L')
                .setCheck('register')
                .appendField('into register ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);

            this.setTooltip('Loads a value from the memory address (stored in a register) into a target register.');
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
                .appendField('into memory at address ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);

            this.setTooltip('Stores the value from one register into the memory address specified by another register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['and'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('=');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' AND ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a bitwise AND between two values and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['ior'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('=');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' OR ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a bitwise inclusive OR between two values and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['eor'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('=');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' XOR ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a bitwise exclusive OR (XOR) between two values and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    const arithmeticOps = [
        ['+', 'add'],
        ['-', 'sub'],
    ];

    Blockly.Blocks['ainst'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField(':=');
            this.appendDummyInput()
                .appendField(" ")
                .appendField(new Blockly.FieldDropdown(() => arithmeticOps), 'operation')
                .appendField(" ")
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Adds two values and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    const logicOps = [
        ['OR', 'ior'],
        ['XOR', 'eor'],
        ['AND', 'and'],
    ];

    Blockly.Blocks['linst'] = {
        init: function () {
            this.appendValueInput('L')
                .setCheck('register')
            this.appendValueInput('A')
                .setCheck('register')
                .appendField(':=');
            this.appendDummyInput()
                .appendField(" ")
                .appendField(new Blockly.FieldDropdown(() => logicOps), 'operation')
                .appendField(" ")
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Adds two values and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['lsl'] = {
        init: function () {
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('do a logical shift left (<<) of');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' by ');
            this.appendValueInput('L')
                .setCheck('register')
                .appendField('bit positions and store result to ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a logical shift to the left by the specified amount and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['lsr'] = {
        init: function () {
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('do a logical shift right (>>) of');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' by ');
            this.appendValueInput('L')
                .setCheck('register')
                .appendField('bit positions and store result to ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs a logical shift to the right by the specified amount and stores the result in a register.');
            this.setColour(operationColor);
        }
    };

    Blockly.Blocks['asr'] = {
        init: function () {
            this.appendValueInput('A')
                .setCheck('register')
                .appendField('do an arithmetic shift right (>>) of');
            this.appendValueInput('B')
                .setCheck(['register', 'immediate'])
                .appendField(' by ');
            this.appendValueInput('L')
                .setCheck('register')
                .appendField('bit positions and store result to ');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Performs an arithmetic (sign-extended) shift to the right and stores the result in a register.');
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
                .appendField('and update status register');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Compares two values (register/immediate) and updates the status register (flags).');
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
            this.setTooltip('Unconditional jump to a specified address (register/immediate/label).');
            this.setColour(jmpColor);
        }
    };

    const branchingConditions = [
        ['equal', 'beq'],
        ['not equal', 'bne'],
        ['greater than', 'bgt'],
        ['greater or equal', 'bge'],
        ['less than', 'blt'],
        ['less or equal', 'ble'],
        ['above', 'bab'],
        ['below', 'bbw'],
        ['above or equal', 'bae'],
        ['below or equal', 'bbe'],
    ];

    Blockly.Blocks['cjmp'] = {
        init: function () {
            this.appendValueInput('A')
                .setCheck(['register', 'immediate', 'label'])
                .appendField('jump to address ');
            this.appendDummyInput('CON')
                .appendField('if last comparison was')
                .appendField(new Blockly.FieldDropdown(() => branchingConditions), 'condition');

            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Branches to the specified address if the last comparison indicated the according result.');
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
            this.setTooltip('This block can contain multiple data-word definitions to be placed in memory.');
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
            this.setTooltip('Declares a single decimal word to be stored in memory.');
            this.setColour(dataWordColor);
            this.setOutput(false, "dataWord");
        }
    };

    Blockly.Blocks['randPerm'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Generate a random permutation of datawords from 1 to")
                .appendField(new Blockly.FieldNumber(1, 1), "n")
                .appendField("using seed")
                .appendField(new Blockly.FieldNumber(0, 0, (2 ** 16 - 1)), "seed");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Declares a shuffled list of datawords from 1 to n');
            this.setColour(dataWordColor);
            this.setOutput(false, "dataWord");
        }
    };

    Blockly.Blocks['rand'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Generate ")
                .appendField(new Blockly.FieldNumber(1, 1), "n")
                .appendField("random values using seed")
                .appendField(new Blockly.FieldNumber(0, 0, (2 ** 16 - 1)), "seed");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('Declares a list of random datawords');
            this.setColour(dataWordColor);
            this.setOutput(false, "dataWord");
        }
    };
}