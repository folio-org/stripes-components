import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import { runAxeTest, Bigtest, including, converge } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Editor from '../Editor';
import Harness from '../../../tests/Harness';

const EditorInteractor = Bigtest.HTML.extend('Editor')
  .selector('[class*=editor---]')
  .locator((el) => el.parentNode.querySelector('label')?.textContent || '')
  .filters({
    id: (el) => el.id,
    error: (el) => el.parentNode.querySelector('[class*=feedbackError---]').textContent,
    warning: (el) => el.parentNode.querySelector('[class*=feedbackWarning---]').textContent,
    class: (el) => el.className
  });

describe.only('Editor', () => {
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
        <Harness>
          <Editor id="test" />
        </Harness>
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
        <Harness>
          <Editor label="This is a label." />
        </Harness>
      );
    });

    it('renders a label element', () => EditorInteractor('This is a label.').exists());
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <Editor error="This is an error." />
        </Harness>
      );
    });

    it('renders an error element', () => editor.has({ error: 'This is an error.' }));

    it('applies an error style', () => editor.has({ class: including('Error') }));
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <Editor warning="This is a warning." />
        </Harness>
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
        <Harness>
          <Editor meta={meta} />
        </Harness>
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
            <Harness>
              <Editor
                editorRef={editorRef}
                value={sample}
                defaultValue={sample}
              />
            </Harness>
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

        await mount(
          <Harness>
            <Editor
              editorRef={editorRef}
              onChange={onChange}
            />
          </Harness>
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

        await mount(
          <Harness>
            <Editor
              editorRef={editorRef}
              value={'<p>text</p><img src=x onerror=alert(1) />'}
              defaultValue={'<p>default</p><img src=y onerror=alert(2) />'}
            />
          </Harness>
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

        await mount(
          <Harness>
            <Editor
              editorRef={anchorRef}
              value={'<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>'}
            />
          </Harness>
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

        await mount(
          <Harness>
            <Editor
              editorRef={editorRef}
              onChange={onChange}
            />
          </Harness>
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
    });
  });
});
