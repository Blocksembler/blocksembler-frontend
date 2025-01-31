import '@blockly/toolbox-search';

export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Basic",
            contents: [
                {
                    kind: "block",
                    type: "start",
                },
                {
                    kind: "block",
                    type: "nop",
                },
                {
                    kind: "block",
                    type: "hlt",
                },
                {
                    kind: "block",
                    type: "trp",
                },
                {
                    kind: "block",
                    type: "data",
                },
                {
                    kind: "block",
                    type: "decimalWord",
                },
                {
                    kind: "block",
                    type: "comment",
                }
            ]
        }, {
            kind: "category",
            name: "Data Declaration",
            contents: [
                {
                    kind: "block",
                    type: "data",
                },
                {
                    kind: "block",
                    type: "decimalWord",
                },
            ]
        },
        {
            kind: "category",
            name: "Primitives",
            color: "50",
            contents: [

                {
                    kind: "block",
                    type: "immediate",
                },
                {
                    kind: "block",
                    type: "label",
                },
                {
                    kind: "block",
                    type: "register",
                },
            ],
        },
        {
            kind: "category",
            name: "Jump Instructions",
            contents: [
                {
                    kind: "block",
                    type: "labelDef",
                },
                {
                    kind: "block",
                    type: "jmp",
                },
                {
                    kind: "block",
                    type: "beq",
                },
                {
                    kind: "block",
                    type: "bne",
                },
                {
                    kind: "block",
                    type: "bgt",
                },
                {
                    kind: "block",
                    type: "bge",
                },
                {
                    kind: "block",
                    type: "blt",
                },
                {
                    kind: "block",
                    type: "ble",
                },
                {
                    kind: "block",
                    type: "bab",
                },
                {
                    kind: "block",
                    type: "bbw",
                },
                {
                    kind: "block",
                    type: "bae",
                },
                {
                    kind: "block",
                    type: "bbe",
                },
            ]
        },
        {
            kind: "category",
            name: "Arithmetic Instructions",
            color: "50",
            contents: [

                {
                    kind: "block",
                    type: "cmp",
                },
                {
                    kind: "block",
                    type: "mov",
                },
                {
                    kind: "block",
                    type: "and",
                },
                {
                    kind: "block",
                    type: "ior",
                },
                {
                    kind: "block",
                    type: "eor",
                },
                {
                    kind: "block",
                    type: "not",
                },
                {
                    kind: "block",
                    type: "add",
                },
                {
                    kind: "block",
                    type: "sub",
                },
                {
                    kind: "block",
                    type: "neg",
                },
                {
                    kind: "block",
                    type: "lsl",
                },
                {
                    kind: "block",
                    type: "lsr",
                },
                {
                    kind: "block",
                    type: "asr",
                },
            ]
        },
        {
            kind: "category",
            name: "Memory Access",
            color: "200",
            contents: [
                {
                    kind: "block",
                    type: "loa",
                },
                {
                    kind: "block",
                    type: "sto",
                },
            ]
        }, {
            'kind': 'search',
            'name': 'Search',
            'contents': [],
        }
    ],
};