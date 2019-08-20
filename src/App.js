import React from 'react';
import {
  EditorState,
} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"
import {
  InputRule,
  inputRules,
} from 'prosemirror-inputrules';
import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {baseKeymap} from "prosemirror-commands"
import { buildKeymap } from './keymaps';

import './app.css';

const pDOM = ["p", 0];
const brDOM = ["br"];

const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "block+"
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM() { return pDOM }
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline",
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
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
        class: "knownVariable"
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
        class: "unknownVariable"
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
        class: "backendVariable"
      }
    ]
  },
}

const plugins = (options) => {
  const variableRule = new InputRule(
    /:(\w+):/,
    (state, match, start, end) => {
      const mark = state.config.schema.marks.knownVariable.instance;
      let { tr: transaction } = state;
      const text = 'Jordan';


      transaction.addStoredMark(mark);
      transaction.insertText('Jordan', start, start + text.length);
      transaction.removeStoredMark(mark);
      // transaction.insertText(' ', start + text.length + 1, start + text.length + 2);


      const newState = state.apply(transaction);
      window.view.updateState(newState);
    }
  )

  const inputRulesPlugin = inputRules({ rules: [variableRule] });

  let plugins = [
    inputRulesPlugin,
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
  ]

  return plugins;
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
