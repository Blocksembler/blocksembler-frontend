<script setup>
import {computed} from "vue";
import {codeParser, emulator} from "../state";

const memoryToInstructionObjects = (progMemory, highlightedLines) => {
  let instructions = [];

  let address = 0;
  while (address < progMemory.length) {
    let inst = codeParser.instructionFactory.createFromOpCode(progMemory, address);

    let binVal = progMemory[address].toBitString();
    let decVal = progMemory[address].toUnsignedIntValue();
    let hexVal = progMemory[address].toHexValue()

    let cssClass = highlightedLines.indexOf(address) !== -1 ? "table-active" : "";

    instructions.push({
      address: address,
      inst: inst,
      binVal: binVal,
      decVal: decVal,
      hexVal: hexVal,
      cssClass: cssClass
    });

    address += 1;
  }

  return instructions;
}

const instructions = computed(() => {
  let highlightedLines = [];
  if (emulator.loadedProgramSize > 0) {
    let pcAddress = emulator.registers.pc.toUnsignedIntValue();
    highlightedLines.push(pcAddress);
    let nextInst = codeParser.instructionFactory.createFromOpCode(emulator.memory, pcAddress);

    if (nextInst.toMachineCode().length / 16 > 1) {
      highlightedLines.push(pcAddress + 1);
    }
  }

  let programMemorySegment = emulator.memory.slice(0, emulator.loadedProgramSize);

  return memoryToInstructionObjects(programMemorySegment, highlightedLines);
});
</script>
<template>
  <div class="card">
    <div class="card-header">
      <h4>Machine Instructions</h4>
    </div>
    <div class="card-body overflow-auto">
      <table v-if="instructions.length !== 0" class="table">
        <thead>
        <tr>
          <th scope="col" style="width: 10%">PC</th>
          <th scope="col" style="width: 10%">Address</th>
          <th scope="col" style="width: 20%">Binary</th>
          <th scope="col" style="width: 15%">Decimal</th>
          <th scope="col" style="width: 15%">Hex</th>
          <th scope="col" style="width: 20%">Assembly</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="instruction in instructions" :class=instruction.cssClass>
          <td>
            <svg
                v-if="
                  instruction.address ===
                  emulator.registers.pc.toUnsignedIntValue()
                "
                class="bi bi-arrow-right-square"
                fill="currentColor"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  fill-rule="evenodd"
              />
            </svg>
          </td>
          <td>
            <pre>0x{{ instruction.address.toString(16).padStart(4, "0") }}</pre>
          </td>
          <td>
            <pre>{{ instruction.binVal.slice(0, 16) }}</pre>
          </td>
          <td>
            <a>
              <pre>{{ instruction.decVal }}</pre>
            </a>
          </td>
          <td>
            <pre>{{ instruction.hexVal }}</pre>
          </td>
          <td>
            <pre>{{ instruction.inst.toString() }}</pre>
          </td>
        </tr>
        </tbody>
      </table>

      <span v-if="instructions.length === 0">
        No machine instructions loaded yet!
      </span>
    </div>
  </div>
</template>
