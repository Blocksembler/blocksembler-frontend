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
                {
                    kind: "block",
                    type: "data",
                    inputs: {
                        "dataWords": {
                            shadow: {
                                type: "decimalWord"
                            }

                        }
                    },
                },
                {kind: "block", type: "decimalWord"},
                {kind: "block", type: "rand"},
                {kind: "block", type: "randPerm"},
            ]
        },
        {
            kind: "category",
            name: "Primitives",
            contents: [
                {kind: "block", type: "decImmediate"},
                {kind: "block", type: "hexImmediate"},
                {kind: "block", type: "register"},
                {kind: "block", type: "label"},
            ]
        },
        {
            kind: "category",
            name: "System Instructions",
            contents: [
                {
                    kind: "block",
                    type: "nop",
                },
                {
                    kind: "block",
                    type: "hlt"
                },
                {
                    kind: "block",
                    type: "trp"
                },
            ]
        },
        {
            kind: "category",
            name: "Memory Instructions",
            contents: [
                {
                    kind: "block",
                    type: "mov",
                    inputs: {
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
                    type: "loa",
                    inputs: {
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
                    inputs: {
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
        },
        {
            kind: "category",
            name: "Arithmetic Instructions",
            contents: [
                {
                    kind: "block",
                    type: "neg",
                    inputs: {
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
                    type: "ainst",
                    inputs: {
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
                }
            ]
        },
        {
            kind: "category",
            name: "Logic Instructions",
            contents: [
                {
                    kind: "block",
                    type: "not",
                    inputs: {
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
                    type: "linst",
                    inputs: {
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
                    type: "lsl",
                    inputs: {
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
                    inputs: {
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
                    inputs: {
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
            name: "Compare and Branching",
            contents: [
                {
                    kind: "block",
                    type: "cmp",
                    inputs: {
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
                    type: "jmp",
                    inputs: {
                        "A": {
                            shadow: {
                                type: "label",
                            },
                        }
                    }
                },
                {
                    kind: "block",
                    type: "cjmp",
                    inputs: {
                        "A": {
                            shadow: {
                                type: "label",
                            },
                        }
                    }
                },
            ]
        }
    ]
};