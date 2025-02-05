import '@blockly/toolbox-search';

export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Program Structure",
            contents: [
                {kind: "block", type: "start"},
                {kind: "block", type: "comment"},
                {kind: "block", type: "labelDef"},
                {kind: "block", type: "data"},
                {kind: "block", type: "decimalWord"},
            ]
        },
        {
            kind: "category",
            name: "Primitives",
            contents: [
                {kind: "block", type: "immediate"},
                {kind: "block", type: "register"},
                {kind: "block", type: "label"},
            ]
        },
        {
            kind: "category",
            name: "System Instructions",
            contents: [
                {kind: "block", type: "nop"},
                {kind: "block", type: "hlt"},
                {kind: "block", type: "trp"},
            ]
        },
        {
            kind: "category",
            name: "Memory Instructions",
            contents: [
                {kind: "block", type: "mov"},
                {kind: "block", type: "loa"},
                {kind: "block", type: "sto"},
            ]
        },
        {
            kind: "category",
            name: "Arithmetic Instructions",
            contents: [
                {kind: "block", type: "neg"},
                {kind: "block", type: "ainst"},
            ]
        },
        {
            kind: "category",
            name: "Logic Instructions",
            contents: [
                {kind: "block", type: "not"},
                {kind: "block", type: "linst"},
                {kind: "block", type: "lsl"},
                {kind: "block", type: "lsr"},
                {kind: "block", type: "asr"},
            ]
        },
        {
            kind: "category",
            name: "Compare and Branching",
            contents: [
                {kind: "block", type: "cmp"},
                {kind: "block", type: "jmp"},
                {kind: "block", type: "cjmp"},
            ]
        }
    ]
};