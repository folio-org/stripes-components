import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { TextArea as Interactor, Label as LabelInteractor, runAxeTest } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import TextArea from '../TextArea';

describe('TextArea', () => {
  describe('supplying no visible label', () => {
    const textArea = Interactor();

    describe('rendering a basic TextArea', async () => {
      beforeEach(async () => {
        await mount(
          <TextArea aria-label="test label" id="test" />
        );
      });

      it('contains no axe errors - TextArea', runAxeTest);

      it('renders a textarea element', async () => {
        await textArea.perform(el => expect(el.querySelector('textarea')).to.exist);
      });

      it('renders no label tag by default', () => textArea.has({ label: undefined }));

      it('applies the id to the textarea', () => textArea.has({ id: 'test' }));


      describe('entering text', async () => {
        beforeEach(() => textArea.fillIn('test'));

        it('updates the value', () => textArea.has({ value: 'test' }));
      });
    });

    describe('supplying an error', () => {
      beforeEach(async () => {
        await mount(
          <TextArea error="This is an error." />
        );
      });

      it('renders the error', () => textArea.has({ error: 'This is an error.' }));
    });

    describe('supplying a warning', () => {
      beforeEach(async () => {
        await mount(
          <TextArea warning="This is a warning." />
        );
      });

      it('renders the warning', () => textArea.has({ warning: 'This is a warning.' }));
    });
  });

  describe('supplying label and id', () => {
    const textArea = Interactor('my test label');

    beforeEach(async () => {
      await mount(
        <TextArea label="my test label" id="myTestInput" />
      );
    });

    it('contains no axe errors - TextArea: label', runAxeTest);

    it('has the expected id', () => textArea.has({ id: 'myTestInput' }));

    it('renders a label element', () => textArea.has({ label: 'my test label' }));

    it('with a filled htmlFor attribute', () => textArea.find(LabelInteractor({ for: 'myTestInput' })).exists());
  });
});
