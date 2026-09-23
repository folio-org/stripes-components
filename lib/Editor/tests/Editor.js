import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import {
  runAxeTest,
  Bigtest,
  including,
  converge,
  Select,
  Button,
  IconButton,
  TextField,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Editor from '../Editor';

const selectTextInContentEditable = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const EditorInteractor = Bigtest.HTML.extend('Editor')
  .selector('[class*="editor---"]')
  .locator((el) => el.parentNode.querySelector('label')?.textContent || '')
  .filters({
    id: (el) => el.id,
    error: (el) => el.parentNode.querySelector('[class*=feedbackError---]').textContent,
    warning: (el) => el.parentNode.querySelector('[class*=feedbackWarning---]').textContent,
    class: (el) => el.className
  })
  .actions({
    selectHeading: async ({ find }, value) => {
      await find(Select('Text style')).choose(value);
    },
    addLink: async ({ perform, find }, url) => {
      await perform(async (el) => {
        const contentEditable = el.querySelector('[contenteditable="true"]');
        selectTextInContentEditable(contentEditable);

        await find(IconButton({ icon: 'link' })).click();
        await find(TextField('Link URL')).fillIn(url);
        await find(Button({ text: 'Apply' })).click();
      });
    },
    removeLink: async ({ perform, find }) => {
      await perform(async (el) => {
        const contentEditable = el.querySelector('[contenteditable="true"]');
        selectTextInContentEditable(contentEditable);

        await find(IconButton({ icon: 'link' })).click();
        await find(Button({ text: 'Remove link' })).click();
      });
    },
    alignText: async ({ find }, alignOption) => {
      await find(IconButton({ icon: `align-${alignOption}` })).click();
    },
    setUnorderedList: async ({ find }) => {
      await find(IconButton({ icon: 'list' })).click();
    },
    setOrderedList: async ({ find }) => {
      await find(IconButton({ icon: 'ordered-list' })).click();
    },
  });

describe('Editor', () => {
  const editor = EditorInteractor();
  const builtInMarkupSamples = [
    '<p><strong>bold</strong> <em>italic</em> <u>underline</u> <s>strike</s></p>',
    '<blockquote>quoted text</blockquote>',
    '<h1>Heading One</h1><h2>Heading Two</h2><p>body text</p>',
    '<ol><li>ordered item</li><li class="ql-indent-1">indented ordered item</li></ol>',
    '<ul><li>bulleted item</li><li class="ql-indent-2">indented bulleted item</li></ul>',
    '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">link text</a></p>',
  ];

  describe('rendering a basic Editor', async () => {
    beforeEach(async () => {
      await mountWithContext(
        <Editor id="test" />
      );
    });

    it.skip('has no axe errors. - Editor', runAxeTest);

    it('renders an editor element', () => editor.exists());

    it('renders no label tag by default', () => Bigtest.HTML('label').absent());

    it('applies the id to the editor', () => editor.has({ id: 'test' }));
  });

  describe('supplying a label', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Editor label="This is a label." />
      );
    });

    it('renders a label element', () => EditorInteractor('This is a label.').exists());
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Editor error="This is an error." />
      );
    });

    it('renders an error element', () => editor.has({ error: 'This is an error.' }));

    it('applies an error style', () => editor.has({ class: including('Error') }));
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Editor warning="This is a warning." />
      );
    });

    it('renders a warning element', () => editor.has({ warning: 'This is a warning.' }));

    it('applies a warning style', () => editor.has({ class: including('Warning') }));
  });

  describe('supplying a meta with an error', () => {
    const meta = {
      touched: true,
      error: 'This is an error.',
    };

    beforeEach(async () => {
      await mountWithContext(
        <Editor meta={meta} />
      );
    });

    it('renders an error element', () => editor.has({ error: 'This is an error.' }));
  });

  describe('sanitization', () => {
    describe('preserving default editor markup', () => {
      it('does not alter built-in markup in value/defaultValue', async () => {
        for (const sample of builtInMarkupSamples) {
          const editorRef = React.createRef();

          await mountWithContext(
            <Editor
              editorRef={editorRef}
              value={sample}
              defaultValue={sample}
            />
          );

          await converge(() => {
            if (!editorRef.current) {
              throw new Error('Expected editorRef to be available');
            }

            if (editorRef.current.options.content !== sample) {
              throw new Error(`Expected content markup to be unchanged: ${sample}`);
            }
          });
        }
      });

      it('does not alter built-in markup in onChange', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await converge(() => {
          if (!editorRef.current) {
            throw new Error('Expected editorRef to be available');
          }
        });

        for (const sample of builtInMarkupSamples) {
          onChange.resetHistory();

          editorRef.current.options.onUpdate({ editor: { getHTML: () => sample } });

          await converge(() => {
            if (!onChange.calledOnce) {
              throw new Error('Expected onChange to be called once');
            }

            if (onChange.firstCall.args[0] !== sample) {
              throw new Error(`Expected changed markup to be unchanged: ${sample}`);
            }
          });
        }
      });
    });

    describe('sanitizing input values', () => {
      let editorRef;

      beforeEach(async () => {
        editorRef = React.createRef();

        await mountWithContext(
          <Editor
            editorRef={editorRef}
            value={'<p>text</p><img src=x onerror=alert(1) />'}
            defaultValue={'<p>default</p><img src=y onerror=alert(2) />'}
          />
        );

        await converge(() => {
          if (!editorRef.current) throw new Error('Expected editorRef to be available');
        });
      });

      it('sanitizes value/defaultValue before passing to TipTap', async () => {
        await converge(() => {
          if (editorRef.current.options.content.includes('onerror')) {
            throw new Error('Expected value to be sanitized');
          }
        });
      });

      it('allows anchor target and rel attributes by default', async () => {
        const anchorRef = React.createRef();

        await mountWithContext(
          <Editor
            editorRef={anchorRef}
            value={'<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>'}
          />
        );

        await converge(() => {
          if (!anchorRef.current) {
            throw new Error('Expected editorRef to be available');
          }

          if (!anchorRef.current.options.content.includes('target="_blank"')) {
            throw new Error('Expected target attribute to be preserved');
          }

          if (!anchorRef.current.options.content.includes('rel="noopener noreferrer"')) {
            throw new Error('Expected rel attribute to be preserved');
          }
        });
      });
    });

    describe('sanitizing output values', () => {
      let editorRef;
      let onChange;

      beforeEach(async () => {
        editorRef = React.createRef();
        onChange = sinon.spy();

        await mountWithContext(
          <Editor
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await converge(() => {
          if (!editorRef.current) throw new Error('Expected editorRef to be available');
        });
      });

      it('sanitizes changed html before calling onChange', async () => {
        const dirtyValue = '<p>updated</p><img src=z onerror=alert(3) />';

        editorRef.current.options.onUpdate({ editor: { getHTML: () => dirtyValue } });

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0].includes('onerror')) {
            throw new Error('Expected changed value to be sanitized');
          }
        });
      });

      it('does not sanitize style attribute', async () => {
        const dirtyValue = '<p style="text-align: right;">align</p>';

        editorRef.current.options.onUpdate({ editor: { getHTML: () => dirtyValue } });

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0] !== '<p style="text-align: right;">align</p>') {
            throw new Error('Expected style attribute to not be sanitized');
          }
        });
      });
    });
  });

  describe('when applying formatting options', () => {
    describe('when changing heading style', () => {
      it('should apply the selected heading to the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value="<p>sample text</p>"
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.selectHeading('Heading 1');

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0] === '<h1>sample text</h1>') {
            throw new Error('Expected heading formatting to be applied');
          }
        });
      });
    });

    describe('when applying a link', () => {
      it('should add a link element to the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value="<p>sample text</p>"
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.addLink('http://test.com');

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0] === '<a target="_blank" rel="noopener noreferrer nofollow" href="http://test.com">sample text</a>') {
            throw new Error('Expected link formatting to be applied');
          }
        });
      });
    });

    describe('when removing an existing link', () => {
      it('should remove the link element from the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value={'<a target="_blank" rel="noopener noreferrer nofollow" href="http://test.com">sample text</a>'}
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.removeLink();

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0] !== '<p>sample text</p>') {
            throw new Error('Expected link formatting to be removed');
          }
        });
      });
    });

    describe('when changing text alignment', () => {
      it('should apply the selected alignment style to the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value="<p>sample text</p>"
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.alignText('right');

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0] !== '<p style="text-align: right;">sample text</p>') {
            throw new Error('Expected text align style to be applied');
          }
        });
      });
    });

    describe('when adding an unordered list', () => {
      it('should add <ul> element to the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value="<p>sample text</p>"
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.setUnorderedList();

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (!onChange.firstCall.args[0].includes('<ul><li><p>sample text</p></li></ul>')) {
            throw new Error('Expected ul and li nodes to be applied');
          }
        });
      });
    });

    describe('when adding an ordered list', () => {
      it('should add <ol> element to the output', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mountWithContext(
          <Editor
            value="<p>sample text</p>"
            editorRef={editorRef}
            onChange={onChange}
          />
        );

        await editor.setOrderedList();

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (!onChange.firstCall.args[0].includes('<ol><li><p>sample text</p></li></ol>')) {
            throw new Error('Expected ul and li nodes to be applied');
          }
        });
      });
    });
  });
});
