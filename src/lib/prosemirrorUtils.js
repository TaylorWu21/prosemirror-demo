const pDOM = ["p", 0];
const brDOM = ["br"];

export const MESSENGER_NODES = {
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

export const MESSENGER_MARKS = {
  knownVariable: {
    inclusive: false,
    parseDOM: [
      {tag: "span"},
    ],
    toDOM: (node) => [
      'span',
      {
        class: "knownVariable",
        contenteditable: false,
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
        contenteditable: false,
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
        contenteditable: false,
      }
    ]
  },
};
