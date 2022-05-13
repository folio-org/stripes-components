import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { TextField as Interactor, Label as LabelInteractor, runAxeTest } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import { label } from '../../../tests/helpers/localInteractors';
import TextField from '../TextField';
import TextFieldHarness from './TextFieldHarness';

describe('TextField', () => {
  const textField = Interactor();

  beforeEach(async () => {
    await mountWithContext(
      <TextField id="tfTest" aria-label="test label" clearFieldId="clearField" />
    );
  });

  it('contains no axe errors - Textfield', runAxeTest);

  it('renders an input type="text" by default', () => textField.has({ type: 'text' }));

  it('renders no label tag by default', () => label().absent());

  it('applies the supplied id prop to the input', () => textField.has({ id: 'tfTest' }));

  describe('entering text into the field', () => {
    beforeEach(() => textField.fillIn('test'));

    it('updates the value', () => textField.has({ value: 'test' }));

    describe('then clicking clear', () => {
      beforeEach(() => textField.clear());

      it('clears the value', () => textField.has({ value: '' }));

      it('focuses the input', () => textField.is({ focused: true }));
    });
  });

  describe('Supplying label and id props', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField label="my test label" id="myTestInput" />
      );
    });

    it('renders the proper label', () => textField.has({ label: 'my test label' }));

    it('with a filled htmlFor attribute', async () => {
      await textField.find(LabelInteractor({ for: 'myTestInput' })).exists();
    });
  });

  describe('supplying an endControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField endControl={<span>testEnd</span>} />
      );
    });

    it('renders the supplied endControl', () => textField.has({ endControl: 'testEnd' }));
  });

  describe('supplying a startControl', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField startControl={<span>testStart</span>} />
      );
    });

    it('renders the supplied startControl', () => textField.has({ startControl: 'testStart' }));
  });

  describe('supplying a value prop with readOnly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextField value="test value prop" readOnly />
      );
    });

    it('displays a value in the textfield', () => textField.has({ value: 'test value prop' }));

    it('sets the readonly attribute', () => textField.is({ readOnly: true }));
  });

  describe('supplying an onChange handler', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TextFieldHarness />
      );
    });

    describe('changing the field', () => {
      beforeEach(() => textField.fillIn('testing text'));

      it('should update value', () => textField.has({ value: 'testing text' }));
    });
  });

  describe('supplying an onFocus handler', () => {
    let focusEventFired = false;

    beforeEach(async () => {
      await mountWithContext(
        <TextField onFocus={() => { focusEventFired = true; }} />
      );
    });

    describe('focusing the field', () => {
      beforeEach(() => textField.focus());

      it('focuses the field', () => textField.is({ focused: true }));

      it('fires the event', () => expect(focusEventFired).to.be.true);
    });
  });

  describe('supplying an onBlur handler', () => {
    let blurEventFired = false;

    beforeEach(async () => {
      await mountWithContext(
        <TextField onBlur={() => { blurEventFired = true; }} />
      );
    });

    describe('blurring the field', () => {
      beforeEach(async () => {
        await textField.focus();
        await textField.blur();
      });

      it('blurs the field', () => textField.is({ focused: false }));

      it('fires the event', () => expect(blurEventFired).to.be.true);
    });
  });

  describe('focusInput()', () => {
    let textFieldComponent;

    beforeEach(async () => {
      await mountWithContext(
        <TextField ref={(ref) => { textFieldComponent = ref; }} />
      );
    });

    describe('focusing the field programmatically', () => {
      beforeEach(() => textFieldComponent.focusInput());

      it('focuses the input', () => textField.is({ focused: true }));
    });
  });

  describe('getInput()', () => {
    const textFieldComponent = React.createRef();

    beforeEach(async () => {
      await mountWithContext(
        <TextField inputRef={textFieldComponent} />
      );
    });

    describe('focusing the field programmatically', () => {
      beforeEach(() => textFieldComponent.current.focus());

      it('focuses the input', () => textField.is({ focused: true }));
    });
  });
});
