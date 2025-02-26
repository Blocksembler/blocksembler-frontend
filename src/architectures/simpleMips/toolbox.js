export const toolbox = {
    kind: "flyoutToolbox",
    contents: [
        {
            kind: "block",
            type: "start",
        },
        {
            kind: "block",
            type: "decImmediate",
        },
        {
            kind: "block",
            type: "register",
        },
        {
            kind: "block",
            type: "noop",
        },
        {
            kind: "block",
            type: "load",
            inputs: {
                operand: {
                    shadow: {
                        kind: "block",
                        type: "register"
                    }
                }
            }
        },
        {
            kind: "block",
            type: "move",
            inputs: {
                operand: {
                    shadow: {
                        kind: "block",
                        type: "register"
                    }
                }
            }
        },
        {
            kind: "block",
            type: "add",
            inputs: {
                operand: {
                    shadow: {
                        kind: "block",
                        type: "register"
                    }
                }
            }
        },
        {
            kind: "block",
            type: "sub",
            inputs: {
                operand: {
                    shadow: {
                        kind: "block",
                        type: "register"
                    }
                }
            }
        },
        {
            kind: "block",
            type: "halt",
        },
    ],
}