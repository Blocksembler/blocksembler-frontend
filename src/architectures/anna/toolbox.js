export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Registers",
            colour: "240",
            contents: [
                {
                    kind: "block",
                    type: "r0",
                },
                {
                    kind: "block",
                    type: "r1",
                },
                {
                    kind: "block",
                    type: "r2",
                },
                {
                    kind: "block",
                    type: "r3",
                },
                {
                    kind: "block",
                    type: "r4",
                },
                {
                    kind: "block",
                    type: "r5",
                },
                {
                    kind: "block",
                    type: "r6",
                },
                {
                    kind: "block",
                    type: "r7",
                },
            ],
        },

        {
            kind: "category",
            name: "Control Flow",
            colour: "240",
            contents: [
                {
                    kind: "block",
                    type: "start",
                },
                {
                    kind: "block",
                    type: "halt",
                },
                {
                    kind: "block",
                    type: "bez",
                },
                {
                    kind: "block",
                    type: "bgz",
                },
                {
                    kind: "block",
                    type: "jalr",
                },
                {
                    kind: "block",
                    type: "labelsection",
                },
                {
                    kind: "block",
                    type: "labeldescriptor",
                },
            ],
        },

        {
            kind: "category",
            name: "Arithmetic Instructions",
            colour: "240",
            contents: [
                {
                    kind: "block",
                    type: "add",
                },
                {
                    kind: "block",
                    type: "addi",
                },
                {
                    kind: "block",
                    type: "sub",
                },
                {
                    kind: "block",
                    type: "and",
                },
                {
                    kind: "block",
                    type: "or",
                },
                {
                    kind: "block",
                    type: "not",
                },
                {
                    kind: "block",
                    type: "shf",
                },
                {
                    kind: "block",
                    type: "lli",
                },
                {
                    kind: "block",
                    type: "lui",
                },
            ],
        },

        {
            kind: "category",
            name: "Input/Output",
            colour: "240",
            contents: [
                {
                    kind: "block",
                    type: "in",
                },
                {
                    kind: "block",
                    type: "out",
                },
            ],
        },

        {
            kind: "category",
            name: "Memory Access",
            colour: "240",
            contents: [
                {
                    kind: "block",
                    type: "lw",
                },
                {
                    kind: "block",
                    type: "sw",
                },
            ],
        },
    ],
};
