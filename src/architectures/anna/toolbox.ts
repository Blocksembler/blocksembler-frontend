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
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        label: {
                            shadow: {
                                type: "label"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "bgz",
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        label: {
                            shadow: {
                                type: "label"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "jalr",
                    inputs: {
                        rs: {
                            shadow: {
                                type: "r7"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r1"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "labelDef",
                },
                {
                    kind: "block",
                    type: "label",
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
                    inputs: {
                        rs1: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rs2: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "addi",
                    inputs: {
                        rs1: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "sub",
                    inputs: {
                        rs1: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rs2: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "and",
                    inputs: {
                        rs1: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rs2: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "or",
                    inputs: {
                        rs1: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rs2: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "not",
                    inputs: {
                        rs: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "shf",
                    inputs: {
                        rs: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "lli",
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "lui",
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "lli_label",

                },
                {
                    kind: "block",
                    type: "lui_label",

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
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "out",
                    inputs: {
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
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
                    inputs: {
                        rs: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "sw",
                    inputs: {
                        rs: {
                            shadow: {
                                type: "r0"
                            }
                        },
                        rd: {
                            shadow: {
                                type: "r0"
                            }
                        },
                    }
                },
            ],
        },
        {
            kind: "category",
            name: "Other",
            colour: "310",
            contents: [
                {
                    kind: "block",
                    type: "fill"
                }
            ]
        }
    ],
};
