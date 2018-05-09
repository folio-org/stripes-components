import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import TextField from '../TextField';

import TextFieldHarness from './TextFieldHarness';

import TextFieldInteractor from './interactor';

describe('TextField', () => {
  const textfield = new TextFieldInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <TextField id="tfTest" />
    );
  });

  it('renders an input type="text" by default', () => {
    expect(textfield.isInput).to.be.true;
    expect(textfield.type).to.equal('text');
  });

  it('renders no label tag by default', () => {
    expect(textfield.labelRendered).to.be.false;
  });

  it('applies the supplied id prop to the input', () => {
    expect(textfield.id).to.equal('tfTest');
  });

  describe('entering text into the field', async () => {
    beforeEach(async () => {
      await textfield.fillInput('test');
    });

    it('updates the value', () => {
      expect(textfield.val).to.equal('test');
    });
  });

  describe('Supplying label and id props', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField label="my test label" id="myTestInput" />
      );
    });

    it('renders a proper label element', () => {
      expect(textfield.labelRendered).to.be.true;
      expect(textfield.label).to.equal('my test label');
    });

    it('with a filled htmlFor attribute', () => {
      expect(textfield.labelFor).to.equal('myTestInput');
    });
  });

  describe('supplying an endControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField endControl={<span>testEnd</span>} />
      );
    });

    it('renders the supplied element in the end-control container', () => {
      expect(textfield.endControl).to.be.true;
    });

    it('applies appropriate padding to the input', () => {
      expect(parseFloat(textfield.inputComputed.paddingRight)).to.be.above(parseFloat(textfield.inputComputed.paddingLeft));
    });
  });

  describe('supplying a startControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField startControl={<span>testStart</span>} />
      );
    });

    it('renders the supplied element in the start-control container', () => {
      expect(textfield.startControl).to.be.true;
    });

    it('applies appropriate padding to the input', () => {
      expect(parseFloat(textfield.inputComputed.paddingLeft)).to.be.above(parseFloat(textfield.inputComputed.paddingRight));
    });
  });

  describe('supplying a value prop with readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField value="test value prop" readOnly />
      );
    });

    it('displays a value in the textfield', () => {
      expect(textfield.val).to.equal('test value prop');
    });

    it('sets the readonly attribute', () => {
      expect(textfield.inputReadOnly).to.equal('');
    });
  });

  describe('supplying an onChange handler', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextFieldHarness />
      );
    });

    describe('changing the field', () => {
      beforeEach(async () => {
        await textfield.fillInput('testing text');
      });

      it('should update value', () => {
        expect(textfield.val).to.equal('testing text');
      });
    });
  });

  describe('Using width redux-form', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field name="testField" component={TextField} clearFieldId="clearField" />
        </TestForm>
      );
    });

    it('should render the textField normally', () => {
      expect(textfield.isInput).to.be.true;
      expect(textfield.type).to.equal('text');
    });

    describe('given an invalid value', () => {
      beforeEach(async () => {
        await textfield.fillBlurInvalid;
      });

      it('renders an error message', () => {
        expect(textfield.inputError).to.be.true;
      });

      it('and also renders a clear button', () => {
        expect(textfield.hasClearButton).to.be.true;
      });

      describe('clicking the clear button', () => {
        beforeEach(async () => {
          await textfield.clickClearButton();
        });

        it('clears the field', () => {
          expect(textfield.val).to.equal('');
        });
      });
    });
  });
});
