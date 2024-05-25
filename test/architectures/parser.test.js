import {expect, test, vi} from "vitest";
import {BaseAssemblerParser} from "../../src/architectures/parser";
import {BranchEqualZeroInstruction} from "../../src/architectures/anna/instructions";

test("parse empty file", () => {
    let emptyFile = "";

    let mockFactory = {
        create: function (type, meta) {
            return {type: type, meta: meta};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([]);
});

test("parse single-line assembler code", () => {
    let emptyFile = "add r1 r2 r3";

    let mockFactory = {
        createFromMnemonic: function (type, meta) {
            return {type: type, meta: meta};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject(
        new Array({
            type: "add",
            meta: {
                args: ["r1", "r2", "r3"],
            },
        })
    );
});

test("parse multi-line assembler code", () => {
    let emptyFile = "add r1 r2 r3\nor r4 r5 r6";

    let mockFactory = {
        createFromMnemonic: function (type, meta) {
            return {type: type, meta: meta};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([
        {
            type: "add",
            meta: {
                args: ["r1", "r2", "r3"],
            },
        },
        {
            type: "or",
            meta: {
                args: ["r4", "r5", "r6"],
            },
        },
    ]);
});

test("parse multi-line assembler code with comments", () => {
    let emptyFile =
        "# this is a comment\nadd r1 r2 r3 # this is a line comment\nor r4 r5 r6\n# add r1 r2 r3 <- this command should be ignored";

    let mockFactory = {
        createFromMnemonic: function (type, meta) {
            return {type: type, meta: meta};
        },
    };

    let parser = new BaseAssemblerParser(mockFactory);
    let result = parser.parseCode(emptyFile);

    expect(result).toMatchObject([
        {
            type: "add",
            meta: {
                args: ["r1", "r2", "r3"],
            },
        },
        {
            type: "or",
            meta: {
                args: ["r4", "r5", "r6"],
            },
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
            meta: {
                label: "loop",
                args: ["r0", -1],
            },
        },
    ]);
});
