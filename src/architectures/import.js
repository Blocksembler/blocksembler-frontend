import * as Blockly from "blockly";
import {codeParser} from "@/state.js";

export const loadWorkspaceFromJson = (ws, json) => {
    Blockly.Events.disable();

    try {
        Blockly.serialization.workspaces.load(json, ws, false);
    } catch (e) {
        console.error(e);
    }

    Blockly.Events.enable();
}

export const loadWorkspaceFromAssemblyCode = (ws, assemblyCode) => {
    ws.clear()
    let startBlock = ws.newBlock('start');
    startBlock.initSvg();

    const parsedProgram = codeParser.parseCode(assemblyCode, false);

    let prevBlock = startBlock;
    for (const instruction of parsedProgram) {

        if (instruction.label) {
            let labelDefBlock = ws.newBlock('labelDef')
            labelDefBlock.initSvg();
            labelDefBlock.getField('label').setValue(instruction.label.slice(1));

            prevBlock.nextConnection.connect(labelDefBlock.previousConnection);
            prevBlock = labelDefBlock;
        }

        const instructionBlock = instruction.toBlock(ws)
        prevBlock.nextConnection.connect(instructionBlock.previousConnection);
        prevBlock = instructionBlock;
    }
}