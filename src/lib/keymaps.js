import {
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
  setBlockType,
} from "prosemirror-commands"
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from "prosemirror-schema-list"
import { undo, redo } from "prosemirror-history"
import { undoInputRule } from "prosemirror-inputrules"

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

export function buildKeymap(schema, mapKeys) {
  let keys = {}, type
  function bind(key, cmd) {
    if (mapKeys) {
      let mapped = mapKeys[key]
      if (mapped === false) return
      if (mapped) key = mapped
    }
    keys[key] = cmd
  }

  bind("Mod-z", undo)
  bind("Shift-Mod-z", redo)
  bind("Backspace", (state, dispatch) => {
    // These two lines fixes the auto cap on deleting
    document.querySelector('.ProseMirror').blur();
    window.view.focus();

    return undoInputRule(state, dispatch);
  })
  if (!mac) bind("Mod-y", redo)

  bind("Alt-ArrowUp", joinUp)
  bind("Alt-ArrowDown", joinDown)
  bind("Mod-BracketLeft", lift)
  bind("Escape", selectParentNode)

  if (type = schema.nodes.hard_break) {
    let br = type, cmd = chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView())
      return true
    })
    bind("Mod-Enter", cmd)
    bind("Shift-Enter", cmd)
    if (mac) bind("Ctrl-Enter", cmd)
  }
  if (type = schema.nodes.list_item) {
    bind("Enter", splitListItem(type))
    bind("Mod-[", liftListItem(type))
    bind("Mod-]", sinkListItem(type))
  }
  if (type = schema.nodes.paragraph) {
    bind("Shift-Ctrl-0", setBlockType(type))
  }

  return keys
}
