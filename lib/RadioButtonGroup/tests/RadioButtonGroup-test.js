import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { HTML, RadioButton as RadioButtonInteractor, runAxeTest } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../RadioButton';

describe('RadioButtonGroup', () => {
  const feedback = HTML.extend('radio button group feedback')
    .selector('[class*=groupFeedback]');
  const options = [RadioButtonInteractor('Yes'), RadioButtonInteractor('No')];

  describe('without value controlled', () => {
    beforeEach(async () => {
      await mount(
        <RadioButtonGroup>
          <RadioButton label="Yes" name="radioField" value="yes" />
          <RadioButton label="No" name="radioField" value="no" />
        </RadioButtonGroup>
      );
    });

    it('contains no axe errors - RadioButtonGroup', runAxeTest);

    it('displays the first option as unselected', () => {
      return options[0].has({ checked: false });
    });

    it('displays the second option as unselected', () => {
      return options[1].has({ checked: false });
    });

    describe('selecting an option', () => {
      beforeEach(async () => {
        await options[0].click();
      });

      it('displays the first option as selected', () => {
        return options[0].has({ checked: true });
      });

      it('displays the second option as unselected', () => {
        return options[1].has({ checked: false });
      });

      describe('selecting another option', () => {
        beforeEach(async () => {
          await options[1].click();
        });

        it('displays the first option as unselected', () => {
          return options[0].has({ checked: false });
        });

        it('displays the second option as selected', () => {
          return options[1].has({ checked: true });
        });
      });
    });
  });

  describe('with value controlled', () => {
    beforeEach(async () => {
      await mount(
        <RadioButtonGroup value="no">
          <RadioButton label="Yes" name="radioField" value="yes" />
          <RadioButton label="No" name="radioField" value="no" />
        </RadioButtonGroup>
      );
    });

    it('displays the first option as unselected', () => {
      return options[0].has({ checked: false });
    });

    it('displays the second option as selected', () => {
      return options[1].has({ checked: true });
    });
  });

  describe('with a warning', () => {
    beforeEach(async () => {
      await mount(
        <RadioButtonGroup warning="radioField has a warning">
          <RadioButton label="Yes" name="radioField" value="yes" />
          <RadioButton label="No" name="radioField" value="no" />
        </RadioButtonGroup>
      );
    });

    it('displays an warning message', () => {
      return feedback().has({ text: 'radioField has a warning' });
    });
  });

  describe('with an error', () => {
    beforeEach(async () => {
      await mount(
        <RadioButtonGroup error="radioField has an error">
          <RadioButton label="Yes" name="radioField" value="yes" />
          <RadioButton label="No" name="radioField" value="no" />
        </RadioButtonGroup>
      );
    });

    it('displays an warning message', () => {
      return feedback().has({ text: 'radioField has an error' });
    });
  });
});
