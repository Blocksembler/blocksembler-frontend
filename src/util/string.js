export const paddString = (bitStr, length, char = "0") => {
  let paddedZeros = "";
  while (bitStr.length + paddedZeros.length < length) {
    paddedZeros += "0";
  }
  return `${paddedZeros}${bitStr}`;
};
