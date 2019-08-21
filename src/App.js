import React from 'react';
import {
  EditorState,
  Plugin
} from "prosemirror-state"
import {
  EditorView,
  Decoration,
  DecorationSet
} from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { keymap } from "prosemirror-keymap"
import { history } from "prosemirror-history"
import { baseKeymap } from "prosemirror-commands"
import { buildKeymap } from './keymaps';

import './app.css';

const pDOM = ["p", 0];
const brDOM = ["br"];

const nodes = {
  doc: {
    content: "block+"
  },
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM() { return pDOM }
  },
  text: {
    group: "inline",
  },
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() { return brDOM }
  }
}

const marks = {
  knownVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
    ],
    toDOM: (node) => [
      'span',
      {
        class: "knownVariable",
      }
    ]
  },

  unknownVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
      {style: "color: red;"}
    ],
    toDOM: (node) => [
      'span',
      {
        class: "unknownVariable",
      }
    ]
  },

  backendVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
      {style: "color: gray;"}
    ],
    toDOM: (node) => [
      'span',
      {
        class: "backendVariable",
      }
    ]
  },
}

class KnownVariableState {
  constructor(knownVariables) {
    this.knownVariables = knownVariables;
  }

  createDecoration(start, end, text) {
    return Decoration.widget(start - 1, () => {
      console.log(start);
      return (<div>hi</div>);
    });
    // return Decoration.inline(to, from, { class: 'knownVariable' })
  }

  apply(tr) {
    const action = tr.getMeta(variablePlugin);
    const actionType = action && action.type;

    if (!action && tr.doChanged) return this;
    if (actionType === 'addKnownVariable') {
      const { start, end, text } = action;
      this.knownVariables = this.knownVariables.add(tr.doc, [this.createDecoration(start, end, text)]);
    }
       
    return new KnownVariableState(this.knownVariables);
  }

  static init(config, state) {
    const decorations = DecorationSet.create(config.doc, []);

    return new KnownVariableState(decorations);
  }
}

const variablePlugin = new Plugin({
  state: {
    init: KnownVariableState.init,
    apply(tr, prev) { return prev.apply(tr) }
  },
  props: {
    decorations(state) { return this.getState(state).knownVariables}
  }
});

const plugins = (options) => {
  return [
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
    variablePlugin,
  ];
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.content = React.createRef();

    const mySchema = new Schema({
      nodes,
      marks,
    });

    window.view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        schema: mySchema,
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')),
        plugins: plugins({ schema: mySchema }),
      }),
      dispatchTransaction: transaction => {
        let { state } = window.view.state.applyTransaction(transaction);
        const regex = /:(\w+):/;
        const textContent = state.doc.textContent;
        const match = textContent.match(regex);
        
        if (match) {
          let { tr: transaction } = state;
          // const mark = state.config.schema.marks.knownVariable.instance;
          const matchedString = match[0]
          const start = textContent.indexOf(matchedString) + 1;
          const end = start + matchedString.length;
          const text = '\xa0Podium\xa0';

          transaction.delete(start, end);
          transaction.setMeta(variablePlugin, { type: 'addKnownVariable', start, end, text });

          //   transaction.addStoredMark(mark);
          // transaction.insertText(text, start);
            
          state = state.apply(transaction);
        }

        window.view.updateState(state);
      }
    });
  }

  render() {
    
    return (
      <>
      </>
    )
  }
}

export default App;
