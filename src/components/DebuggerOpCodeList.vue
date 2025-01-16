<script setup>
import {computed} from "vue";
import {codeParser, emulator} from "../state";
import {paddString} from "../util/string.js";

const memoryToInstructionObjects = (progMemory) => {
  let instructions = [];

  let address = 0;
  while (address < progMemory.length) {
    let inst = codeParser.instructionFactory.createFromOpCode(progMemory, address);

    let size = inst.toMachineCode().length / emulator.addressSize;

    instructions.push({address: address, isInstruction: true, inst: inst});

    for (let offset = 1; offset < size; offset++) {
      let binaryValue = progMemory[address + offset].toBitString()
      instructions.push({address: address + offset, isInstruction: false, binaryValue: binaryValue});
    }

    address += size;
  }

  return instructions;
}

const instructions = computed(() => {
  let programMemorySegment = emulator.memory.slice(0, emulator.loadedProgramSize);

  return memoryToInstructionObjects(programMemorySegment);
});
</script>
<template>
  <div class="card">
    <div class="card-header">
      <h4>Machine Instructions</h4>
    </div>
    <div class="card-body">
      <table v-if="instructions.length !== 0" class="table">
        <thead>
        <tr>
          <th scope="col" style="width: 10%">PC</th>
          <th scope="col" style="width: 15%">Address</th>
          <th scope="col" style="width: 30%">Machine Code</th>
          <th scope="col" style="width: 45%">Source</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="instruction in instructions">
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
          <td>0x{{ paddString(instruction.address.toString(16), 4) }}</td>
          <td>
            <pre v-if="instruction.isInstruction">{{ instruction.inst.toMachineCode().slice(0, 16) }}</pre>
            <pre v-else>{{ instruction.binaryValue }}</pre>
          </td>
          <td>
            <a v-if="instruction.isInstruction">
              {{ instruction.inst.toString() }}
            </a>
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
