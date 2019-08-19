import React from 'react';
import { EditorState } from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"
import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {baseKeymap} from "prosemirror-commands"
import { buildKeymap } from './keymaps';
import _ from 'lodash';

const pDOM = ["p", 0];
const brDOM = ["br"];
const spanDOM = ["span"];

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
    group: "inline"
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
  blueVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
      {style: "color: blue;"}
    ],
    toDOM() { return spanDOM }
  },

  redVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
      {style: "color: red;"}
    ],
    toDOM() { return spanDOM }
  },

  grayVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
      {style: "color: gray;"}
    ],
    toDOM() { return spanDOM }
  }
}

const plugins = (options) => {
  let plugins = [
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

    console.log(mySchema, 'mySchema');

    window.view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        schema: mySchema,
        // doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')),
        plugins: plugins({ schema: mySchema }),
      }),
      // dispatchTransaction: (transaction) => {
      //   console.log(window.view)
      //   console.log(transaction);

      //   window.view.state.applyTransaction(transaction);

      //   // window.view.applyTransaction(transaction);
      //   // window.view.updateState(transaction);

      // }
    })

    console.log(window.view);
  }

  render() {
    
    return (
      <>
      </>
    )
  }
}

export default App;
