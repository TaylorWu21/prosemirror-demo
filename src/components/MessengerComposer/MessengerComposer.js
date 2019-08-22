import React from 'react';
import {
  EditorState,
  Selection,
} from "prosemirror-state"
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

          transaction.delete(start, end)
          transaction.addStoredMark(mark);
          transaction.insertText(variableValue, start);

          state = state.apply(transaction);
        }

        window.view.updateState(state);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { contact } = this.props;

    if (prevProps.contact !== contact) {
      const {
        doc: { textContent },
        tr: transaction,
        doc,
        config
      } = window.view.state;
      const start = textContent.indexOf(prevProps.contact);
      const end = start + textContent.length;
      const resolvedFrom = doc.resolve(start + 1);
      const resolvedTo = doc.resolve(end + 1);
      const setSelection = new Selection(resolvedFrom, resolvedTo);
      const markedNode = doc.nodeAt(start);
      console.log(setSelection, 'setSelection')
      console.log(markedNode, 'markedNode');
      transaction.setSelection(setSelection);
      transaction.deleteSelection();
      transaction.insertText(contact, start);
      const mark = config.schema.marks.knownVariable.instance;
      transaction.addStoredMark(mark);

      window.view.dispatch(transaction);

      // console.log(markedNode.textContent.length)

      // console.log(markedNode, 'markedNode');
      // console.log(transaction, 'transaction');

      // console.log(textContent, 'content');
    }
  }

  render() {
    return (
      <>
      </>
    )
  }
}

export default MessengerComposer;
