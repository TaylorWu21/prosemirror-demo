import React from 'react';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  SelectionRange
} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
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
import _ from 'lodash';

import './app.css';

const pDOM = ["p", 0];
const brDOM = ["br"];
const spanDOM = ["span", 0];
const strongDOM = ["strong", 0];

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

  strong: {
    parseDOM: [{tag: "strong"},
               // This works around a Google Docs misbehavior where
               // pasted content will be inexplicably wrapped in `<b>`
               // tags with a font-weight normal.
               {tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null},
               {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
    toDOM() { return strongDOM }
  },
}

const plugins = (options) => {
  const variableRule = new InputRule(
    /:(\w+):/,
    (state, match, start, end) => {
      const transaction = state.tr;
      const mark = state.config.schema.marks.knownVariable.instance;
      const { $anchor, $head } = transaction.selection;
      const selection = TextSelection.between($anchor, $head);
      console.log(selection, 'selection');

      transaction.addStoredMark(mark);
      const newState = state.apply(transaction);
      window.view.updateState(newState);
      const $from = state.selection.$anchor;

      const node = NodeSelection.create(state.doc, start);
    }
  )

  const inputRulesPlugin = inputRules({ rules: [variableRule] });

  let plugins = [
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
    inputRulesPlugin,
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

    // console.log(mySchema, 'mySchema');

    window.view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        schema: mySchema,
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')),
        plugins: plugins({ schema: mySchema }),
      }),
    })

    console.log(window.view, 'view');
  }

  render() {
    
    return (
      <>
      </>
    )
  }
}

export default App;
