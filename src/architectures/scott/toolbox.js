export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Basic",
            contents: [
                {"kind": "block", "type": "start"},
                {"kind": "block", "type": "comment"},
                {"kind": "block", "type": "labelDef"},
                {"kind": "block", "type": "decImmediate"},
                {"kind": "block", "type": "label"},
                {"kind": "block", "type": "register"},
            ],
        },
        {
            kind: "category",
            name: "ALU Instructions",
            contents: [
                {
                    "kind": "block",
                    "type": "clf"
                },
                {
                    "kind": "block",
                    "type": "add"
                },
                {
                    "kind": "block",
                    "type": "shr"
                },
                {
                    "kind": "block",
                    "type": "shl"
                },
                {
                    "kind": "block",
                    "type": "not"
                },
                {
                    "kind": "block",
                    "type": "and"
                },
                {
                    "kind": "block",
                    "type": "or"
                },
                {
                    "kind": "block",
                    "type": "xor"
                },

            ],
        },
        {
            kind: "category",
            name: "Memory Instructions",
            contents: [
                {
                    "kind": "block",
                    "type": "data",
                },
                {
                    "kind": "block",
                    "type": "st",
                },
                {
                    "kind": "block",
                    "type": "ld",
                },
            ]
        },
        {
            kind: "category",
            name: "Compare & Jump",
            contents: [
                {
                    "kind": "block",
                    "type": "cmp"
                },
                {
                    "kind": "block",
                    "type": "jmp"
                },
                {
                    "kind": "block",
                    "type": "jcaez"
                },
            ],
        },

    ]
};