import {expect, test, vi} from "vitest";
import {BaseAssemblerParser} from "@/architectures/parser.js";
import {BranchEqualZeroInstruction} from "@/architectures/anna/instructions.js";

test("parse empty file", () => {
    let emptyFile = "";

    let parser = new BaseAssemblerParser({});
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([]);
});

test("parse single-line assembler code", () => {
    let sourceCode = "add r1 r2 r3";

    let mockFactory = {
        createFromMnemonic: function (type, args) {
            return {type: type, args: args};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(sourceCode);

    expect(result).toMatchObject(
        new Array({
            type: "add",
            args: ["r1", "r2", "r3"],
        })
    );
});

test("parse addi instruction", () => {
   let sourceCode = "addi r1 r2 -1";

    let mockFactory = {
        createFromMnemonic: function (type, args) {
            return {type: type, args: args};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(sourceCode);

    expect(result).toMatchObject(
        new Array({
            type: "addi",
            label: null,
            args: ["r1", "r2", "-1"],
        })
    );
});

test("parse multi-line assembler code", () => {
    let emptyFile = "add r1 r2 r3\nor r4 r5 r6";

    let mockFactory = {
        createFromMnemonic: function (type, args) {
            return {type: type, args: args};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([
        {
            type: "add",
            args: ["r1", "r2", "r3"],

        },
        {
            type: "or",
            args: ["r4", "r5", "r6"],
        },
    ]);
});

test("parse multi-line assembler code with comments", () => {
    let emptyFile =
        "# this is a comment\nadd r1 r2 r3 # this is a line comment\nor r4 r5 r6\n# add r1 r2 r3 <- this command should be ignored";

    let mockFactory = {
        createFromMnemonic: function (type, args) {
            return {type: type, args: args};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([
        {
            type: "add",
            args: ["r1", "r2", "r3"],
        },
        {
            type: "or",
            args: ["r4", "r5", "r6"],
        },
    ]);
});

test("parse assembler code with labels", () => {
    let assemblerCode = "loop: bez r0 &loop";
    let mockFactory = {
        createFromMnemonic: vi.fn().mockImplementationOnce((type, meta) => {
            return new BranchEqualZeroInstruction(meta);
        }),
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(assemblerCode);
    expect(result).toMatchObject([
        {
            label: "loop",
            args: ["r0", -1],
        },
    ]);
});
