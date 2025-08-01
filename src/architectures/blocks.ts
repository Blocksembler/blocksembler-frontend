import * as Blockly from "blockly";
import {FieldMultilineInput} from "@blockly/field-multilineinput";

export const setupDefaultBlocks = (): void => {
    Blockly.Blocks['comment'] = {
        init: function () {
            this.appendDummyInput('label text')
                .appendField(new FieldMultilineInput('This is a multi-\nline comment!'), 'text');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('This block can be used to add multi-line comments to the source code.');
            this.setColour(60);
        }
    };
}