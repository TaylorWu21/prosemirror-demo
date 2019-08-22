import React from 'react';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  SelectionRange
} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {
  Schema,
  DOMParser,
  ResolvedPos,
  Slice,
} from "prosemirror-model"
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

const users = [
  { name: 'Taylor Wu', mention: '@taylor.wu' },
  { name: 'Jordan Wu', mention: '@jordan.wu' },
  { name: 'Jonathon Davis', mention: '@jonathan.davis' },
]

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
  mention: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
    ],
    toDOM: (node) => [
      'span',
      {
        class: "mention"
      }
    ]
  },
}

class TeamchatComposer extends React.Component {
  constructor(props) {
    super(props);

    this.editor = React.createRef();
    this.content = React.createRef();

    const mySchema = new Schema({
      nodes,
      marks,
    });

    // console.log(mySchema, 'mySchema');

    this.view = new EditorView(document.querySelector('#teamchat'), {
      state: EditorState.create({
        schema: mySchema,
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#teamchat-content')),
        plugins: this.plugins({ schema: mySchema }),
      }),
    })

    this.state = { showMentions: false };
  }

  plugins = (options) => {
    const mentionRule = new InputRule(
      /(^|[\s(){}[\]\\|;:'"<>,/?!])@(\S+)$/,
      (state, match, start, end) => {
        const transaction = state.tr;
        const mark = state.config.schema.marks.mention.instance;
        const { doc } = transaction;

        const slice = new Slice(doc, start, end);

        // debugger;

        transaction.addStoredMark(mark).replaceSelection(slice);

        console.log(slice, 'slice');
        // debugger;

        // transaction.addStoredMark(mark);
        // const newState = state.apply(transaction);
        // this.view.updateState(newState);
        // const $from = state.selection.$anchor;

        // const node = NodeSelection.create(state.doc, start);
      }
    )

    // if user adds @ then trigger the mention menu
    const openMentions = new InputRule(
      /@$/,
      (state, match, start, end) => {
        if (match.index === start - 1) {
          this.setState({ showMentions: true });
        }
      }
    )

    // TODO FIX THIS TO ALSO TRIGGER ON TEXT DELETE
    const closeMentions = new InputRule(
      /^((?!@).)*$/,
      (state, match, start, end) => {
        if (this.state.showMentions) {
          console.log('close mention')
          this.setState({ showMentions: false });
        }
      }
    )

    const inputRulesPlugin = inputRules({
      rules: [mentionRule, openMentions, closeMentions]
    });

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

  handleMentionClick = (user) => {
    // TODO DO SOMEtHING IN THE COMPOSER
    this.setState({ showMentions: false });
    console.log(user);
    console.log(this.view, 'view');

    // FIND THE MENTION IN THE TEXT
    // DELETE THE text from the node
    // create a new node with the new mark and text
    // appened new node to the content
    // create a new transition
    // update the view
    const view = this.view;
    debugger;
  }

  render() {
    const { showMentions } = this.state;

    if (showMentions) {
      return (
        users.map(user => (
          <button onClick={() => this.handleMentionClick(user)}>
            <li>{user.name} - {user.mention}</li>
          </button>
        ))
      )
    }
    
    return (
      <>
      </>
    )
  }
}

export default TeamchatComposer;
