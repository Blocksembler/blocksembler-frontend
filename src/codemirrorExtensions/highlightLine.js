import { EditorView, Decoration, ViewPlugin } from "@codemirror/view";
import { StateField, RangeSet, StateEffect } from "@codemirror/state";

const baseTheme = EditorView.baseTheme({
  ".active": {
    backgroundColor: "yellow",
    color: "black",
  },
});

let lineNumber = StateField.define({
  create() {
    return RangeSet.of([], true);
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(highlightLinesEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

const showStripes = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = view.state.field(lineNumber);
    }

    update(update) {
      this.decorations = update.view.state.field(lineNumber);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

export function lineHighlighter() {
  return [baseTheme, lineNumber, showStripes];
}

const highlightLinesEffect = StateEffect.define();

export function highlightLine(view, lineNumber) {
  if (lineNumber > 0 && lineNumber <= view.state.doc.lines) {
    let range = view.state.doc.line(lineNumber).from;
    view.dispatch({
      effects: highlightLinesEffect.of(
        RangeSet.of([Decoration.line({ class: "active" }).range(range)], true)
      ),
    });
  } else {
    view.dispatch({
      effects: highlightLinesEffect.of(RangeSet.of([], true)),
    });
  }
}
