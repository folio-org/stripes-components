import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import { runAxeTest, Bigtest, including, converge } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Editor from '../Editor';

const EditorInteractor = Bigtest.HTML.extend('Editor')
  .selector('.quill')
  .locator((el) => el.parentNode.querySelector('label')?.textContent || '')
  .filters({
    id: (el) => el.id,
    error: (el) => el.parentNode.querySelector('[class*=feedbackError---]').textContent,
    warning: (el) => el.parentNode.querySelector('[class*=feedbackWarning---]').textContent,
    class: (el) => el.className
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
      await mount(
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
      await mount(
        <Editor label="This is a label." />
      );
    });

    it('renders a label element', () => EditorInteractor('This is a label.').exists());
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <Editor error="This is an error." />
      );
    });

    it('renders an error element', () => editor.has({ error: 'This is an error.' }));

    it('applies an error style', () => editor.has({ class: including('Error') }));
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
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
      await mount(
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

          await mount(
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

            if (editorRef.current.props.value !== sample) {
              throw new Error(`Expected value markup to be unchanged: ${sample}`);
            }

            if (editorRef.current.props.defaultValue !== sample) {
              throw new Error(`Expected defaultValue markup to be unchanged: ${sample}`);
            }
          });
        }
      });

      it('does not alter built-in markup in onChange', async () => {
        const editorRef = React.createRef();
        const onChange = sinon.spy();

        await mount(
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

          editorRef.current.props.onChange(sample);

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

        await mount(
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

      it('sanitizes value before passing to ReactQuill', async () => {
        await converge(() => {
          if (editorRef.current.props.value.includes('onerror')) {
            throw new Error('Expected value to be sanitized');
          }
        });
      });

      it('sanitizes defaultValue before passing to ReactQuill', async () => {
        await converge(() => {
          if (editorRef.current.props.defaultValue.includes('onerror')) {
            throw new Error('Expected defaultValue to be sanitized');
          }
        });
      });

      it('allows anchor target and rel attributes by default', async () => {
        const anchorRef = React.createRef();

        await mount(
          <Editor
            editorRef={anchorRef}
            value={'<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>'}
          />
        );

        await converge(() => {
          if (!anchorRef.current) {
            throw new Error('Expected editorRef to be available');
          }

          if (!anchorRef.current.props.value.includes('target="_blank"')) {
            throw new Error('Expected target attribute to be preserved');
          }

          if (!anchorRef.current.props.value.includes('rel="noopener noreferrer"')) {
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

        await mount(
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

        editorRef.current.props.onChange(dirtyValue);

        await converge(() => {
          if (!onChange.calledOnce) {
            throw new Error('Expected onChange to be called once');
          }

          if (onChange.firstCall.args[0].includes('onerror')) {
            throw new Error('Expected changed value to be sanitized');
          }
        });
      });
    });
  });
});
