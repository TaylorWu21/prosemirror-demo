import React from 'react';
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
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
  return [
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
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
          const mark = state.config.schema.marks.knownVariable.instance;
          const matchedString = match[0]
          const start = textContent.indexOf(matchedString) + 1;
          const end = start + matchedString.length;
          const text = '\xa0Podium\xa0';

          transaction.delete(start, end)
          transaction.addStoredMark(mark);
          transaction.insertText(text, start);

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
