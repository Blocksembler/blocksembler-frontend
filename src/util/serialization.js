import * as Blockly from "blockly/core";

const storageKey = "blocksambler-local-storage";

export const save = function (workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

export const load = function (workspace) {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, false);
  Blockly.Events.enable();
};
