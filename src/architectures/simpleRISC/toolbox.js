export const toolbox = {
    kind: "flyoutToolbox",
    contents: [
        {
            kind: "block",
            type: "start",
        },

        {
            kind: "block",
            type: "label",
        },

        {
            kind: "block",
            type: "labelDef",
        },

        {
            kind: "block",
            type: "immediate",
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
            type: "and",
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
            type: "or",
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
            type: "xor",
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
            type: "not",
        },
        {
            kind: "block",
            type: "lshift",
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
            type: "rshift",
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
            type: "compare",
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
            type: "jump",
        },
        {
            kind: "block",
            type: "beq",

        },
        {
            kind: "block",
            type: "bgt",

        },
        {
            kind: "block",
            type: "halt",
        },
    ],
}