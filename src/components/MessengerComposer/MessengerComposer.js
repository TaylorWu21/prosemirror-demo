import React from 'react';
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { keymap } from "prosemirror-keymap"
import { history } from "prosemirror-history"
import { baseKeymap } from "prosemirror-commands"

import { buildKeymap } from '../../lib/keymaps';
import { MESSENGER_NODES, MESSENGER_MARKS } from '../../lib/prosemirrorUtils';

const plugins = (options) => {
  return [
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
  ];
}

class MessengerComposer extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.content = React.createRef();

    const mySchema = new Schema({
      nodes: MESSENGER_NODES,
      marks: MESSENGER_MARKS,
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
          const variableValue = this.props[match[1]];

          if (!variableValue) {
            console.log('bad variable');
          }
          const text = `\xa0${variableValue}\xa0`;

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

export default MessengerComposer;
