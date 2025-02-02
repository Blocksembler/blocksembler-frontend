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
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "beq",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bne",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bgt",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bge",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "blt",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "ble",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bab",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bbw",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bae",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
                },
                {
                    kind: "block",
                    type: "bbe",
                    inputs : {
                        "A": {
                            shadow: {
                                type: "label",
                            },

                        }
                    }
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
                    inputs : {
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "mov",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "and",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "ior",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "eor",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "not",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "add",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sub",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "neg",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "lsl",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "lsr",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "asr",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "B": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
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
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sto",
                    inputs : {
                        "L": {
                            shadow: {
                                type: "register",
                            },
                        },
                        "A": {
                            shadow: {
                                type: "register",
                            },
                        }
                    }
                },
            ]
        }, {
            'kind': 'search',
            'name': 'Search',
            'contents': [],
        }
    ],
};