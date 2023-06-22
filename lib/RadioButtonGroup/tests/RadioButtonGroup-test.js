import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { converge, runAxeTest } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../../RadioButton';
import RadioButtonGroupInteractor from './interactor';

describe('RadioButtonGroup', () => {
  const radioButtonGroup = new RadioButtonGroupInteractor();

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
      converge(() => expect(radioButtonGroup.options(0).isChecked).to.be.false);
    });

    it('displays the second option as unselected', () => {
      converge(() => expect(radioButtonGroup.options(1).isChecked).to.be.false);
    });

    describe('selecting an option', () => {
      beforeEach(async () => {
        await radioButtonGroup.options(0).clickAndBlur();
      });

      it('displays the first option as selected', () => {
        expect(radioButtonGroup.options(0).isChecked).to.be.true;
      });

      it('displays the second option as unselected', () => {
        expect(radioButtonGroup.options(1).isChecked).to.be.false;
      });

      describe('selecting another option', () => {
        beforeEach(async () => {
          await radioButtonGroup.options(1).clickAndBlur();
        });

        it('displays the first option as unselected', () => {
          expect(radioButtonGroup.options(0).isChecked).to.be.false;
        });

        it('displays the second option as selected', () => {
          expect(radioButtonGroup.options(1).isChecked).to.be.true;
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
      converge(() => expect(radioButtonGroup.options(0).isChecked).to.be.false);
    });

    it('displays the second option as selected', () => {
      converge(() => expect(radioButtonGroup.options(1).isChecked).to.be.true);
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

    it('displays a warning message', () => {
      converge(() => expect(radioButtonGroup.feedbackText).to.equal('radioField has a warning'));
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

    it('displays a warning message', () => {
      converge(() => expect(radioButtonGroup.feedbackText).to.equal('radioField has a warning'));
    });
  });
});
