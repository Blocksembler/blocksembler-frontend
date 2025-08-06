import {expect, test} from "vitest";
import {AnnaAssemblyParser} from "@/architectures/anna/parser";
import {
    AddImmediateInstruction,
    AddInstruction,
    BranchEqualZeroInstruction,
    OrInstruction
} from "@/architectures/anna/instructions";

import {MultilineComment} from "@/architectures/instructions";

test("parse empty file", () => {
    let emptyFile = "";

    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([]);
});

test("parse single-line assembler code", () => {
    let assemblerCode = ["add r1 r2 r3"];

    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(assemblerCode.join('\n'));

    expect(result).toEqual([
        new AddInstruction(["r1", "r2", "r3"]),
    ]);
});

test("parse addi instruction", () => {
    let assemblerCode = ["addi r1 r2 -1"];
    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(assemblerCode.join('\n'));

    expect(result).toEqual([
        new AddImmediateInstruction(["r1", "r2", "-1"]),
    ]);
});

test("parse multi-line assembler code", () => {
    let assemblerCode = [
        "add r1 r2 r3",
        "or r4 r5 r6",
    ];

    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(assemblerCode.join('\n'));

    expect(result).toEqual([
        new AddInstruction(["r1", "r2", "r3"]),
        new OrInstruction(["r4", "r5", "r6"]),
    ]);
});

test("parse multi-line assembler code with comments", () => {
    let assemblerCode = [
        "# this is a comment",
        "add r1 r2 r3 # this is a line comment",
        "or r4 r5 r6",
        "# add r1 r2 r3 <- this command should be ignored",
    ]

    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(assemblerCode.join('\n'));

    expect(result).toEqual([
        new MultilineComment(" this is a comment"),
        new AddInstruction(["r1", "r2", "r3"], [], " this is a line comment"),
        new OrInstruction(["r4", "r5", "r6"]),
        new MultilineComment(" add r1 r2 r3 <- this command should be ignored")
    ]);
});

test("parse assembler code with labels", () => {
    let assemblerCode = ["loop: bez r0 &loop"];

    let parser = new AnnaAssemblyParser();
    let result = parser.parseCode(assemblerCode.join('\n'));
    expect(result).toEqual([
        new BranchEqualZeroInstruction(["r0", "-1"], ["loop"])
    ]);
});