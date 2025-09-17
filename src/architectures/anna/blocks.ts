import * as Blockly from "blockly";

export const setupBlocklyBlocks = () => Blockly.common.defineBlocksWithJsonArray([
    {
        type: "add",
        message0: "add %1 %2 and %3 and store result to %4",
        args0: [
            {
                type: "input_dummy",
            },
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "input_value",
                name: "rs2",
                check: "register",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "addi",
        message0: "add %1 %2 and %3 and store result to %4",
        args0: [
            {
                type: "input_dummy",
            },
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -32,
                max: 31,
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "sub",
        message0: "subtract %1 %2 and %3 and store result to %4",
        args0: [
            {
                type: "input_dummy",
            },
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "input_value",
                name: "rs2",
                check: "register",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "lli",
        message0: "set lower 8 bits of register %1 to %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -128,
                max: 255,
            },
        ],
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "lui",
        message0: "set upper 8 bits of register %1 to %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -128,
                max: 255,
            },
        ],
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "lli_label",
        message0: "load lower 8-bits of label %1 to lower 8-bits of register %2",
        args0: [
            {
                type: "input_value",
                name: "label",
                check: "label"
            },
            {
                type: "input_value",
                name: "rd",
                check: "register"
            }
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: ""
    },
    {
        type: "lui_label",
        message0: "load upper 8-bits of label %1 to upper 8-bits of register %2",
        args0: [
            {
                type: "input_value",
                name: "label",
                check: "label"
            },
            {
                type: "input_value",
                name: "rd",
                check: "register"
            }
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: ""
    },
    {
        type: "and",
        message0: 'Do bit-wise "and" between  %1 and %2 and store result to %3',
        args0: [
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "input_value",
                name: "rs2",
                check: "register",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "or",
        message0: 'Do bit-wise "or" between  %1 and %2 and store result to %3',
        args0: [
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "input_value",
                name: "rs2",
                check: "register",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "not",
        message0: 'Do bit-wise "not" on %1 and store result to %2',
        args0: [
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "shf",
        message0: "shift register  %1 by %2 %3 and store result to %4",
        args0: [
            {
                type: "input_value",
                name: "rs1",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 1,
                min: -32,
                max: 31,
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_value",
                name: "rd",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "lw",
        message0: "load word from address %1 + %2 %3 and store result to %4",
        args0: [
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -32,
                max: 31,
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 120,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "sw",
        message0: "store %1 to memory address %2 + %3",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "input_value",
                name: "rs1",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -32,
                max: 31,
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 120,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "in",
        message0: "read input to register %1",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 330,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "out",
        message0: "output register %1",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 330,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "bez",
        message0: "if  %1 equals zero, jump to label %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "input_value",
                name: "label",
                check: "label",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "bgz",
        message0: "if  %1 is greater than zero, jump to label %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "input_value",
                name: "label",
                check: "label",
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "bezImmediate",
        message0: "if  %1 equals zero, change PC register by  %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -128,
                max: 255
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "bgzImmediate",
        message0: "if  %1 is greater than zero, change PC register by %2",
        args0: [
            {
                type: "input_value",
                name: "rd",
                check: "register",
            },
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -128,
                max: 255
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "jalr",
        message0: "store PC+1 to  %1 and jump to address in %2",
        args0: [
            {
                type: "input_value",
                name: "rs1",
                check: ["register"],
            },
            {
                type: "input_value",
                name: "rd",
                check: ["register"],
            },
        ],
        inputsInline: true,
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "halt",
        message0: "halt",
        previousStatement: ["instruction", "label"],
        nextStatement: ["instruction"],
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "start",
        message0: "start",
        nextStatement: "",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r0",
        message0: "r0",
        output: "register",
        colour: 0,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r1",
        message0: "r1",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },

    {
        type: "r2",
        message0: "r2",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r3",
        message0: "r3",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r4",
        message0: "r4",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r5",
        message0: "r5",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r6",
        message0: "r6",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "r7",
        message0: "r7",
        output: "register",
        colour: 122,
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "labelDef",
        tooltip: "mov instruction",
        helpUrl: "",
        message0: "label:  %1",
        args0: [
            {
                type: "field_input",
                name: "name",
                text: "loop"
            },
        ],
        previousStatement: ["instruction"],
        nextStatement: ["label"],
        colour: 225,
        inputsInline: true
    },
    {
        type: "label",
        helpUrl: "",
        message0: "label: %1",
        args0: [
            {
                type: "field_input",
                name: "name",
                text: "default"
            }
        ],
        output: "label",
        colour: 225,
        inputsInline: true
    },
    {
        type: "fill",
        tooltip: "",
        helpUrl: "",
        message0: "fill this spot with value %1",
        args0: [
            {
                type: "field_number",
                name: "immediate",
                value: 0,
                min: -32768,
                max: 65535
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 225,
        inputsInline: true
    }
]);
