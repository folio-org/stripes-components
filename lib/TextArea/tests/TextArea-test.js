import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import TextArea from '../TextArea';
import TextAreaInteractor from './interactor';

describe('TextArea', () => {
  const textArea = new TextAreaInteractor();

  describe('rendering a basic TextArea', async () => {
    beforeEach(async () => {
      await mount(
        <TextArea id="test" />
      );
    });

    it('renders a textarea element', () => {
      expect(textArea.hasTextArea).to.be.true;
    });

    it('renders no label tag by default', () => {
      expect(textArea.hasLabel).to.be.false;
    });

    it('applies the id to the textarea', () => {
      expect(textArea.id).to.equal('test');
    });
  });

  describe('entering text', async () => {
    beforeEach(async () => {
      await textArea.fillTextArea('test');
    });

    it('updates the value', () => {
      expect(textArea.val).to.equal('test');
    });
  });

  describe('supplying label and id', () => {
    beforeEach(async () => {
      await mount(
        <TextArea label="my test label" id="myTestInput" />
      );
    });

    it('renders a label element', () => {
      expect(textArea.label).to.equal('my test label');
    });

    it('with a filled htmlFor attribute', () => {
      expect(textArea.labelFor).to.equal('myTestInput');
    });
  });

  describe('supplying an error', () => {
    beforeEach(async () => {
      await mount(
        <TextArea error="This is an error." />
      );
    });

    it('renders an error element', () => {
      expect(textArea.errorText).to.equal('This is an error.');
    });

    it('applies an error style', () => {
      expect(textArea.hasErrorStyle).to.be.true;
    });
  });

  describe('supplying a warning', () => {
    beforeEach(async () => {
      await mount(
        <TextArea warning="This is a warning." />
      );
    });

    it('renders a warning element', () => {
      expect(textArea.warningText).to.equal('This is a warning.');
    });

    it('applies a warning style', () => {
      expect(textArea.hasWarningStyle).to.be.true;
    });
  });
});
