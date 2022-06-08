import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Editor from '../Editor';
import EditorInteractor from './interactor';

describe('Editor', () => {
  const editor = new EditorInteractor();

  describe('rendering a basic Editor', async () => {
    beforeEach(async () => {
      await mount(
        <Editor id="test" />
      );
    });

    it.skip('has no axe errors. - Editor', runAxeTest);

    it('renders an editor element', () => {
      expect(editor.hasEditor).to.be.true;
    });

    it('renders no label tag by default', () => {
      expect(editor.hasLabel).to.be.false;
    });

    it('applies the id to the editor', () => {
      expect(editor.id).to.equal('test');
    });
  });

  describe('supplying a label', () => {
    beforeEach(async () => {
      await mount(
        <Editor label="This is a label." />
      );
    });

    it('renders a label element', () => {
      expect(editor.hasLabel).to.be.true;
    });
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <Editor error="This is an error." />
      );
    });

    it('renders an error element', () => {
      expect(editor.errorText).to.equal('This is an error.');
    });

    it('applies an error style', () => {
      expect(editor.hasErrorStyle).to.be.true;
    });
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
        <Editor warning="This is a warning." />
      );
    });

    it('renders a warning element', () => {
      expect(editor.warningText).to.equal('This is a warning.');
    });

    it('applies a warning style', () => {
      expect(editor.hasWarningStyle).to.be.true;
    });
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

    it('renders an error element', () => {
      expect(editor.errorText).to.equal(meta.error);
    });
  });
});
