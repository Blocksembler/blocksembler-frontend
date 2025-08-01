import {expect, test} from "vitest";
import {ArmletAssemblyParser} from "@/architectures/armlet/parser.js";
import {
    AddImmediateInstruction,
    AndImmediateInstruction,
    ArmletInstructionFactory,
    AsrImmediateInstruction,
    AsrInstruction,
    BabImmediateInstruction,
    BabInstruction,
    BaeImmediateInstruction,
    BaeInstruction,
    BbeImmediateInstruction,
    BbeInstruction,
    BbwImmediateInstruction,
    BbwInstruction,
    BeqImmediateInstruction,
    BeqInstruction,
    BgeImmediateInstruction,
    BgeInstruction,
    BgtImmediateInstruction,
    BgtInstruction,
    BleImmediateInstruction,
    BleInstruction,
    BltImmediateInstruction,
    BltInstruction,
    BneImmediateInstruction,
    BneInstruction,
    CmpImmediateInstruction,
    CmpInstruction,
    DataDirective,
    EorImmediateInstruction,
    EorInstruction,
    IorImmediateInstruction,
    IorInstruction,
    JmpImmediateInstruction,
    JmpInstruction,
    LoaInstruction,
    LslImmediateInstruction,
    LslInstruction,
    LsrImmediateInstruction,
    LsrInstruction,
    MovImmediateInstruction,
    MovInstruction,
    NegInstruction,
    NopInstruction,
    RandDirective,
    RandPermDirective,
    StoInstruction,
    SubImmediateInstruction,
    SubInstruction
} from "@/architectures/armlet/instructions.js";
import {AddInstruction, AndInstruction, NotInstruction} from "@/architectures/anna/instructions.js";
import {ParsingError} from "@/architectures/parser";

import {MultilineComment} from "@/architectures/instructions";


test('test new parser', () => {
    let sourceCode = [
        '@inlinelabel: mov $2, >test',
        '',
        '',
        '# this is a comment',
        '# abc',
        '',
        '@test:',
        '',
        '# test 2',
        '# abc',
        '',
        'mov $1, $2 # in-line comment',
        '',
        '',
        'nop',
    ];

    let expectedProgram = [
        new MovImmediateInstruction(["$2", "2"], ["@inlinelabel"]),
        new MultilineComment(" this is a comment\n abc"),
        new MultilineComment(" test 2\n abc"),
        new MovInstruction(["$1", "$2"], ["@test"], " in-line comment"),
        new NopInstruction()
    ]

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());
    let generatedProgram = parser.parseCode(sourceCode.join('\n'));

    expect(generatedProgram).toEqual(expectedProgram);
});

test('test error on undefined label', () => {
    let sourceCode = [
        'mov $2, >test',
        'nop',
    ];

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());

    expect(() => parser.parseCode(sourceCode.join('\n')))
        .toThrow(new ParsingError(1, 'Label "@test" not defined.'));

});

test('test error on defining the same label twice', () => {
    let sourceCode = [
        '@label:',
        'mov $2, 123',
        '@label:',
        'nop',
    ];

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());

    expect(() => parser.parseCode(sourceCode.join('\n')))
        .toThrow(new ParsingError(3, 'Label "@label" already defined.'));
})

test('test error on invalid instruction', () => {
    let sourceCode = [
        'mov $1, $0',
        'mo $2, $1',
        'nop'
    ]

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());

    expect(() => parser.parseCode(sourceCode.join('\n')))
        .toThrow(new ParsingError(2, 'Failed to parse instruction at line 2'));
});

test('test parsing programm with all instructions', () => {
    let program = [
        "nop",
        "mov $0, $1",
        "mov $0, 123",
        "and $0, $1, $2",
        "and $0, $1, 123",
        "ior $0, $1, $2",
        "ior $0, $1, 123",
        "eor $0, $1, $2",
        "eor $0, $1, 123",
        "not $0, $1",
        "add $0, $1, $2",
        "add $0, $1, 123",
        "sub $0, $1, $2",
        "sub $0, $1, 123",
        "neg $0, $1",
        "lsl $0, $1, $2",
        "lsl $0, $1, 1",
        "lsr $0, $1, $2",
        "lsr $0, $1, 1",
        "asr $0, $1, $2",
        "asr $0, $1, 1",
        "loa $0, $1",
        "sto $0, $1",
        "cmp $0, $1",
        "cmp $0, 1",
        "jmp $1",
        "beq $1",
        "bne $1",
        "bgt $1",
        "blt $1",
        "bge $1",
        "ble $1",
        "bab $1",
        "bbw $1",
        "bae $1",
        "bbe $1",
        "jmp 1",
        "beq 1",
        "bne 1",
        "bgt 1",
        "blt 1",
        "bge 1",
        "ble 1",
        "bab 1",
        "bbw 1",
        "bae 1",
        "bbe 1",
        "%data 1, 2, 3",
        "%randperm 1, 2",
        "%rand 3, 4",
    ]

    let expectedProgram = [
        new NopInstruction(),
        new MovInstruction(['$0', '$1']),
        new MovImmediateInstruction(['$0', '123']),
        new AndInstruction(['$0', '$1', '$2']),
        new AndImmediateInstruction(['$0', '$1', '123']),
        new IorInstruction(['$0', '$1', '$2']),
        new IorImmediateInstruction(['$0', '$1', '123']),
        new EorInstruction(['$0', '$1', '$2']),
        new EorImmediateInstruction(['$0', '$1', '123']),
        new NotInstruction(['$0', '$1']),
        new AddInstruction(['$0', '$1', '$2']),
        new AddImmediateInstruction(['$0', '$1', '123']),
        new SubInstruction(['$0', '$1', '$2']),
        new SubImmediateInstruction(['$0', '$1', '123']),
        new NegInstruction(['$0', '$1']),
        new LslInstruction(['$0', '$1', '$2']),
        new LslImmediateInstruction(['$0', '$1', '1']),
        new LsrInstruction(['$0', '$1', '$2']),
        new LsrImmediateInstruction(['$0', '$1', '1']),
        new AsrInstruction(['$0', '$1', '$2']),
        new AsrImmediateInstruction(['$0', '$1', '1']),
        new LoaInstruction(['$0', '$1']),
        new StoInstruction(['$0', '$1']),
        new CmpInstruction(['$0', '$1']),
        new CmpImmediateInstruction(['$0', "1"]),
        new JmpInstruction(['$1']),
        new BeqInstruction(['$1']),
        new BneInstruction(['$1']),
        new BgtInstruction(['$1']),
        new BltInstruction(['$1']),
        new BgeInstruction(['$1']),
        new BleInstruction(['$1']),
        new BabInstruction(['$1']),
        new BbwInstruction(['$1']),
        new BaeInstruction(['$1']),
        new BbeInstruction(['$1']),
        new JmpImmediateInstruction(['1']),
        new BeqImmediateInstruction(['1']),
        new BneImmediateInstruction(['1']),
        new BgtImmediateInstruction(['1']),
        new BltImmediateInstruction(['1']),
        new BgeImmediateInstruction(['1']),
        new BleImmediateInstruction(['1']),
        new BabImmediateInstruction(['1']),
        new BbwImmediateInstruction(['1']),
        new BaeImmediateInstruction(['1']),
        new BbeImmediateInstruction(['1']),
        new DataDirective(["1", "2", "3"]),
        new RandPermDirective(["1", "2"]),
        new RandDirective(["3", "4"]),
    ]

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());
    let parsedProgram = parser.parseCode(program.join('\n'))

    expect(parsedProgram).toEqual(expectedProgram);
});

test("label on directives", () => {
    const sourceProgram = [
        "mov $7, >len",
        "loa $0, $7",
        "mov $2, >target",
        "@len:",
        "%data 0",
        "@target:",
        "%data 1, 2, 3",
    ]

    const expectedProgram = [
        new MovImmediateInstruction(["$7", "5"]),
        new LoaInstruction(["$0", "$7"]),
        new MovImmediateInstruction(["$2", "6"]),
        new DataDirective(["0"], ["@len"]),
        new DataDirective(["1", "2", "3"], ["@target"]),
    ]

    let parser = new ArmletAssemblyParser(new ArmletInstructionFactory());

    expect(parser.parseCode(sourceProgram.join('\n'))).toEqual(expectedProgram);
});