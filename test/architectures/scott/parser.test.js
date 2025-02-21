import {expect, test} from "vitest";
import {ScottAssemblyParser} from "@/architectures/scott/parser.js";
import {
    AddInstruction,
    AndInstruction,
    CmpInstruction,
    DataInstruction,
    JumpAddressInstruction,
    JumpIfEqualInstruction,
    ShiftRightInstruction
} from "@/architectures/scott/instructions.js";

const assemblerCode = [
    "       DATA R0, 123",
    "       DATA R1, 0",
    ".loop:",
    "       DATA R2, 1",
    "       AND R0, R2",
    "       CMP R1, R2",
    "       JE .was_zero",
    "       ADD R2, R3",
    ".was_zero:",
    "       SHR R0, R0",
    "       JMP .loop",
];

test("test parsing a full assembly program", () => {

    const parser = new ScottAssemblyParser()
    const program = parser.parseCode(assemblerCode.join('\n'));

    const expected = [
        new DataInstruction(["R0", "123"]),
        new DataInstruction(["R1", "0"]),
        new DataInstruction(["R2", "1"], ".loop"),
        new AndInstruction(["R0", "R2"]),
        new CmpInstruction(["R1", "R2"]),
        new JumpIfEqualInstruction(["11"]),
        new AddInstruction(["R2", "R3"]),
        new ShiftRightInstruction(["R0", "R0"], ".was_zero"),
        new JumpAddressInstruction(["4"]),
    ]

    expect(program).toStrictEqual(expected);
});