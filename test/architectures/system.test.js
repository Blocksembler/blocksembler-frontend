import {expect, test} from "vitest";
import {ImmutableWord, Word} from "../../src/architectures/system";

test("initialize word with bit string", () => {
    let bitString = "1101";
    let word = Word.fromString(bitString);

    expect(word.bits).toMatchObject([1, 0, 1, 1]);
    expect(word.bits.length).toBe(bitString.length);
});

test("initialize word with array", () => {
    let bitArray = [0, 1, 1, 0, 1, 0, 1, 1, 1];
    let word = Word.fromBitArray(bitArray);

    expect(word.bits).toMatchObject([0, 1, 1, 0, 1, 0, 1, 1, 1]);
});

test("initialize word with positive integer", () => {
    let initValue = 4;
    let size = 8;

    let word = Word.fromSignedIntValue(initValue, size);

    expect(word.bits).toMatchObject([0, 0, 1, 0, 0, 0, 0, 0]);
});

test("initialize word with negative integer", () => {
    let initValue = -3;
    let size = 8;

    let word = Word.fromSignedIntValue(initValue, size);

    expect(word.bits).toMatchObject([1, 0, 1, 1, 1, 1, 1, 1]);
});

test("initialize word with too large number (overflow)", () => {
    let initValue = 16;
    let size = 4;

    let word = Word.fromSignedIntValue(initValue, size);
    expect(word.bits).toMatchObject([0, 0, 0, 0]);
});

test("toSignedIntValue returns negative number for 0b11111111", () => {
    let word = Word.fromBitArray([1, 1, 0, 1, 0, 0, 1, 1]); // = -53
    expect(word.toSignedIntValue()).toBe(-53);
});

test("test if 0b0001 + 0b0001 = 0b0010", () => {
    let operand_one = Word.fromString("0001");
    let operand_two = Word.fromString("0001");

    let result = operand_one.add(operand_two);

    expect(result.toSignedIntValue()).toBe(2);
});

test("test if 0b1111 + 0b0001 = 0b0000", () => {
    let operand_one = Word.fromString("1111");
    let operand_two = Word.fromString("0001");

    let result = operand_one.add(operand_two);

    expect(result.toSignedIntValue()).toBe(0);
});

test("test if 0b0000 - 0b0001 = 0b1111", () => {
    let operand_one = Word.fromString("0000");
    let operand_two = Word.fromString("0001");

    let result = operand_one.subtract(operand_two);

    expect(result.toSignedIntValue()).toBe(-1);
});

test("test if 0b0101 | 0b1010 = 0b1111", () => {
    let operand_one = Word.fromString("1010");
    let operand_two = Word.fromString("0101");

    let result = operand_one.or(operand_two);

    expect(result.bits).toMatchObject([1, 1, 1, 1]);
});

test("test if 0b10111110 & 0b11110000 = 0b10110000", () => {
    let operand_one = Word.fromString("10111110");
    let operand_two = Word.fromString("11110000");

    let result = operand_one.and(operand_two);

    expect(result.bits).toMatchObject([0, 0, 0, 0, 1, 1, 0, 1]);
});

test("test if pushing 0b1111 to the left by 1 = 0b1110", () => {
    let word = Word.fromString("1111");
    let result = word.shift(1);
    expect(result.bits).toMatchObject([0, 1, 1, 1]);
});

test("test if pushing 0b1111 to the right by 1 = 0b0111", () => {
    let word = Word.fromString("1111");
    let result = word.shift(-1);
    expect(result.bits).toMatchObject([1, 1, 1, 0]);
});

test("test if immutable word is not changed after set operation", () => {
    let word = ImmutableWord.fromString("0000");
    word.set(Word.fromString("1111"));
    expect(word.toSignedIntValue()).toBe(0);
});
