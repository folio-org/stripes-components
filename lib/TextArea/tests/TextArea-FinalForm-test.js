import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field, Form } from 'react-final-form';
import { mountWithContext } from '../../../tests/helpers';
import TextArea from '../TextArea';
import TextAreaInteractor from './interactor';

describe('TextArea with Final Form', () => {
  const textArea = new TextAreaInteractor();

  describe('inputting a value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={TextArea}
            />
          )}
        />
      );
    });

    it('renders a textarea element', () => {
      expect(textArea.hasTextArea).to.be.true;
    });

    describe('changing the value', () => {
      beforeEach(async () => {
        await textArea.fillTextArea('anything')
          .focusTextArea();
      });

      it('applies a changed class', () => {
        expect(textArea.hasChangedStyle).to.be.true;
      });
    });
  });

  describe('inputting an invalid value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={TextArea}
              validate={value => (value === 'invalid' ? 'testField is Invalid' : undefined)}
            />
          )}
        />
      );
    });

    beforeEach(async () => {
      await textArea.fillAndBlur('invalid');
    });

    it('applies an error style', () => {
      expect(textArea.hasErrorStyle).to.be.true;
    });

    it('renders an error message', () => {
      expect(textArea.errorText).to.equal('testField is Invalid');
    });
  });

  describe('inputting an valid value with validStylesEnabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={() => (
            <Field
              name="testField"
              component={TextArea}
              validStylesEnabled
              validate={value => (value === undefined ? 'testField cannot be blank' : undefined)}
            />
          )}
        />
      );
    });

    beforeEach(async () => {
      await textArea.fillAndBlur('valid');
    });

    it('applies a valid class', () => {
      expect(textArea.hasValidStyle).to.be.true;
    });

    describe('then removing the text', () => {
      beforeEach(async () => {
        await textArea.fillAndBlur('');
      });

      it('applies an error style', () => {
        expect(textArea.hasErrorStyle).to.be.true;
      });

      it('renders an error message', () => {
        expect(textArea.errorText).to.equal('testField cannot be blank');
      });
    });
  });
});
