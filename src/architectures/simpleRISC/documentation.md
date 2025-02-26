# SimpleMIPS

Word Length: 16-bit

Registers: 16 registers

```
0000 0000 0011 1111
0123 4567 8901 2345

???O OOOM AAAA AAAA


O = OpCode (4-bit)
M = Argument Mode (1-bit)
      M=1 => arg is immediate
      M=0 => arg addresses register
A = Argument (8-bit)
```

| OpCode | Mnemonic  | Description                                                                       |
|--------|-----------|-----------------------------------------------------------------------------------|
| `0000` | `NOOP`    | do nothing                                                                        |
| `0001` | `LOAD`    | load operand to the lower 8 bits of `$ACC` register                               |
| `0010` | `MOVE`    | move $ACC to the register specified by the operand                                |
| `0011` | `ADD`     | add operand to `$ACC` register                                                    |
| `0100` | `SUB`     | subtract operand from `$ACC` register                                             | 
| `0101` | `AND`     | do logical and operation on `$ACC` and the operand and store the result to `$ACC` |
| `0110` | `OR`      | do logical or operation on `$ACC` and the operand and store the result to `$ACC`  |
| `0111` | `XOR`     | do logical or operation on `$ACC` and the operand and store the result to `$ACC`  |
| `1000` | `NOT`     | invert the bits of the `$ACC` register                                            |
| `1001` | `LSHIFT`  | shift `$ACC` to the left by n where n == operand                                  |
| `1010` | `RSHIFT`  | shift `$ACC` to the right by n where n == operand                                 |
| `1011` | `COMPARE` | compare `$ACC` to the provided operand and set status flags                       |
| `1100` | `JUMP`    | unconditional jump to label                                                       |
| `1101` | `BEQ`     | jump to label if status flag eq is true                                           |
| `1110` | `BGT`     | jump to label if status flag gt is true                                           |
| `1111` | `HALT`    | stop execution                                                                    |

