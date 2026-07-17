import {
  TextNode,
  $createTextNode,
} from 'lexical';

const wrapElementWith = (element, tag) => {
  const el = document.createElement(tag);
  el.appendChild(element);

  return el;
};

class SanitizedTextNode extends TextNode {
  static getType() {
    return 'sanitized-text';
  }

  static clone(node) {
    return new SanitizedTextNode(node.__text, node.__key);
  }

  exportDOM(editor) {
    let element = super.createDOM(editor._config, editor);

    // This is the only way to properly add support for most clients,
    // even if it's semantically incorrect to have to resort to using
    // <b>, <u>, <s>, <i> elements.

    element.removeAttribute('class');

    if (element !== null) {
      if (this.hasFormat('strikethrough')) {
        element = wrapElementWith(element, 's');
      }

      if (this.hasFormat('italic')) {
        element = wrapElementWith(element, 'i');
      }

      if (this.hasFormat('underline')) {
        element = wrapElementWith(element, 'u');
      }
    }

    return {
      element,
    };
  }
}

export { SanitizedTextNode };
