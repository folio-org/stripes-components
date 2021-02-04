import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Field } from 'redux-form';
import { mount, mountWithContext } from '../../../tests/helpers';
import TestForm from '../../../tests/TestForm';
import Harness from '../../../tests/Harness';

import Checkbox from '../Checkbox';
import CheckboxInteractor from './interactor';

describe('Checkbox', () => {
  const checkbox = new CheckboxInteractor();

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
      await checkbox.focusInput();
    });

    it('has an id on the input element', () => {
      expect(checkbox.id).to.equal('checkbox-test');
    });

    it('has a custom className applied', () => {
      expect(checkbox.className).to.include('custom-class');
    });

    it('is full width', () => {
      expect(checkbox.isFullWidth).to.be.true;
    });

    it('is has a label', () => {
      expect(checkbox.label).to.equal('My label');
    });

    it('is rendered vertically', () => {
      expect(checkbox.isVertical).to.be.true;
    });

    it('is has an aria-label', () => {
      expect(checkbox.ariaLabel).to.equal('My aria label');
    });

    it('should fire an onFocus callback', () => {
      expect(focused).to.be.true;
    });

    it('should not render the labelInfo', () => {
      expect(checkbox.labelInfoIsPresent).to.be.false;
    });
  });

  describe('with warning text', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox warning="That's not a great value." />
      );
    });

    it('displays the warning text', () => {
      expect(checkbox.feedbackText).to.equal('That\'s not a great value.');
    });

    it('applies a warning class', () => {
      expect(checkbox.hasWarningStyle).to.be.true;
    });
  });

  describe('with error text', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox error="That's a bad value." />
      );
    });

    it('displays the error text', () => {
      expect(checkbox.feedbackText).to.equal('That\'s a bad value.');
    });

    it('applies an error class', () => {
      expect(checkbox.hasErrorStyle).to.be.true;
    });

    it('sets the aria-invalid attribute to true', () => {
      expect(checkbox.ariaInvalid).to.equal('true');
    });
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

    it('displays the input as unchecked', () => {
      expect(checkbox.isChecked).to.be.false;
    });

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkbox.clickLabel();
      });

      it('toggles the value', () => {
        expect(output).to.equal('bananas');
      });

      it('displays the input as checked', () => {
        expect(checkbox.isChecked).to.be.true;
      });
    });
  });

  describe('coupled to redux-form', () => {
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

    it('displays the input as unchecked', () => {
      expect(checkbox.isChecked).to.be.false;
    });

    describe('clicking the label', () => {
      beforeEach(async () => {
        await checkbox.clickLabel();
      });

      it('toggles the value', () => {
        expect(output).to.be.true;
      });

      it('displays the input as checked', () => {
        expect(checkbox.isChecked).to.be.true;
      });

      describe('toggling the checkbox back to off', () => {
        beforeEach(async () => {
          await checkbox.clickAndBlur();
        });

        it('displays the error text', () => {
          expect(checkbox.feedbackText).to.equal('Required');
        });

        it('applies an error class', () => {
          expect(checkbox.hasErrorStyle).to.be.true;
        });
      });
    });
  });

  describe('if a createRef() is passed to the inputRef-prop', () => {
    const ref = React.createRef();

    beforeEach(async () => {
      await mount(
        <Checkbox
          id="checkbox-ref-test"
          inputRef={ref}
        />
      );
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

      await checkbox.clickLabel();
    });

    it('should not fire the onChange callback', () => {
      expect(changed).to.be.undefined;
    });
  });

  describe('a checkbox without a label-prop', () => {
    let output;
    beforeEach(async () => {
      await mount(
        <Checkbox
          id="checkbox-no-label-test"
          value="no-label-checkbox"
          onChange={(event) => { output = event.target.value; }}
        />
      );
      await checkbox.clickInput();
    });

    it('should not render a <label>-element', () => {
      expect(checkbox.hasLabelElement).to.be.false;
    });

    it('should fire onChange callback when clicking the <input>', () => {
      expect(output).to.equal('no-label-checkbox');
    });
  });

  describe('a checkbox with a labelInfo-prop', () => {
    beforeEach(async () => {
      await mount(
        <Checkbox labelInfo={5} />
      );
    });

    it('should render a count element', () => {
      expect(checkbox.labelInfo).to.equal('5');
    });
  });
});
