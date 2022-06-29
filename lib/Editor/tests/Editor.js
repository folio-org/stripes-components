import React from 'react';
import { describe, beforeEach, it } from 'mocha';

import { runAxeTest, Bigtest, including } from '@folio/stripes-testing';
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

    it('renders an error element', () => editor.has({ error: 'This is an error.'}));

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
});
