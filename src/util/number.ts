export function isDecimal(str: string) {
    const decimalRegex = /^-?(?:\d+\.?\d*|\.\d+)$/;
    return decimalRegex.test(str);
}

export function isHex(str: string) {
    const hexRegex = /^0x[0-9a-fA-F]+$/;
    return hexRegex.test(str);
}