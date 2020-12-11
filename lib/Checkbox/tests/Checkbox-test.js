import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { Checkbox as Interactor } from '@folio/stripes-testing';
import { mount, mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import Harness from '../../../tests/Harness';

import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  const checkboxWithLabel = Interactor('My label');

  describe('render a checkbox', () => {
    let focused;
    beforeEach(async () => {
      await mount(
        <Checkbox
          id="checkbox-test"
          className="custom-class"
          label="My label"
          aria-label="My aria label"
          onFocus={() => { focused = true; }}
          fullWidth
          vertical
        />
      );
      await checkboxWithLabel.focus();
    });

    it('has an id on the input element', () => checkboxWithLabel.has({ id: 'checkbox-test' }));

    it('has a custom className applied', () => checkboxWithLabel.perform((el) => expect(el.className).to.have.string('custom-class')));

    it('is full width', () => checkboxWithLabel.perform((el) => expect(el.className).to.have.string('fullWidth')));

    it('has a label', () => checkboxWithLabel.has({ label: 'My label' }));

    it('is rendered vertically', () => checkboxWithLabel.perform((el) => expect(el.className).to.have.string('vertical')));

    it('is has an aria-label', () => checkboxWithLabel.has({ ariaLabel: 'My aria label' }));

    it('should fire an onFocus callback', () => {
      expect(focused).to.be.true;
    });
  });

  describe('with warning text', () => {
    const checkboxNoLabel = Interactor();
    beforeEach(async () => {
      await mount(<Checkbox warning="That's not a great value." />);
    });

    it('displays the warning text', () => checkboxNoLabel.has({ feedbackText: 'That\'s not a great value.' }));

    it('applies a warning class', () => checkboxNoLabel.has({ hasWarning: true }));

    it('leaves the aria-invalid attribute as false', () => checkboxNoLabel.has({ ariaInvalid: false }));
  });

  describe('with error text', () => {
    const checkboxNoLabel = Interactor();
    beforeEach(async () => {
      await mount(<Checkbox error="That's a bad value." />);
    });

    it('displays the error text', () => checkboxNoLabel.has({ feedbackText: 'That\'s a bad value.' }));

    it('applies an error class', () => checkboxNoLabel.has({ hasError: true }));

    it('sets the aria-invalid attribute to true', () => checkboxNoLabel.has({ ariaInvalid: true }));
  });

  describe('with a value', () => {
    let output;

    beforeEach(async () => {
      await mount(
        <Checkbox
          value="bananas"
          label="My label"
          onChange={(event) => { output = event.target.value; }}
        />
      );
    });

    it('displays the input as unchecked', () => checkboxWithLabel.is({ checked: false }));

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkboxWithLabel.click();
      });

      it('toggles the value', () => checkboxWithLabel.has({ value: 'bananas' }));

      it('fires the onChange with value', () => expect(output).to.equal('bananas'));

      it('displays the input as checked', () => checkboxWithLabel.is({ checked: true }));
    });
  });

  describe('coupled to redux-form', () => {
    const checkboxBananas = Interactor('Bananas');
    let output = false;

    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field
            name="bananas"
            label="Bananas"
            component={Checkbox}
            onChange={(event, newValue) => {
              output = newValue;
            }}
            validate={value => (value ? undefined : 'Required')}
          />
        </TestForm>
      );
    });

    it('displays the input as unchecked', () => checkboxBananas.is({ checked: false }));

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkboxBananas.click();
      });

      it('toggles the onChange value', () => {
        expect(output).to.be.true;
      });

      it('displays the input as checked', () => checkboxBananas.is({ checked: true }));

      describe('toggling the checkbox back to off', () => {
        beforeEach(async () => {
          await checkboxBananas.clickAndBlur();
        });

        it('toggles the onChange value off', () => {
          expect(output).to.be.false;
        });

        it('displays the error text', () => checkboxBananas.has({ feedbackText: 'Required' }));

        it('applies an error class', () => checkboxBananas.perform((el) => expect(el.className).to.have.string('hasError')));
      });
    });
  });

  describe('if a createRef() is passed to the inputRef-prop', () => {
    const ref = React.createRef();

    beforeEach(async () => {
      await mount(<Checkbox id="checkbox-ref-test" inputRef={ref} />);
    });

    it('should return a valid ref', () => {
      expect(ref.current).to.not.be.null;
    });
  });

  describe('if a function is passed to the inputRef-prop', () => {
    let element;

    beforeEach(async () => {
      await mount(
        <Checkbox inputRef={(el) => { element = el; }} />
      );
    });

    it('should pass a HTML input element as a parameter to the passed function', () => {
      expect(element.constructor.name).to.equal('HTMLInputElement');
    });
  });

  describe('if the readOnly prop is true', () => {
    let changed;

    beforeEach(async () => {
      await mount(
        <Harness>
          <Checkbox
            label="Read only checkbox"
            id="checkbox-ref-test"
            readOnly
            onChange={() => { changed = true; }}
          />
        </Harness>
      );

      await Interactor().click();
    });

    it('should not fire the onChange callback', () => {
      expect(changed).to.be.undefined;
    });
  });

  describe('a checkbox without a label-prop', () => {
    const checkboxWithoutLabel = Interactor();
    let output;
    beforeEach(async () => {
      await mount(
        <Checkbox
          id="checkbox-no-label-test"
          value="no-label-checkbox"
          onChange={(event) => { output = event.target.value; }}
        />
      );
      await checkboxWithoutLabel.clickInput();
    });

    it('should not render a <label>-element', () => Interactor('').absent());

    it('toggles the value', () => checkboxWithoutLabel.has({ value: 'no-label-checkbox' }));

    it('should fire onChange callback when clicking the <input>', () => {
      expect(output).to.equal('no-label-checkbox');
    });
  });
});
