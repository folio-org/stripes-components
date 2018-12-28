import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';

import CheckboxFilter from '../CheckboxFilter';
import CheckboxFilterInteractor from './interactor';


describe('CheckboxFilter', () => {
  const checkboxFilter = new CheckboxFilterInteractor();
  const onChangeHandler = sinon.spy();

  const renderComponent = (props) => {
    return mountWithContext(
      <CheckboxFilter
        name="language"
        onChange={onChangeHandler}
        options={[
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'French' },
          { value: 'ge', label: 'German' },
          { value: 'it', label: 'Italian' },
        ]}
        {...props}
      />
    );
  };

  beforeEach(async () => {
    await renderComponent();

    onChangeHandler.resetHistory();
  });

  it('should render all filter options', () => {
    expect(checkboxFilter.optionsCount).to.equal(4);
  });


  describe('after click on readonly option', () => {
    beforeEach(async () => {
      await renderComponent({
        options: [
          {
            value: 'en',
            label: 'English',
            readOnly: true,
          },
        ]
      });
      await checkboxFilter.options(0).click();
    });

    it('should not call onChange callback', () => {
      expect(onChangeHandler.called).to.equal(false);
    });
  });

  describe('after click on disabled option', () => {
    beforeEach(async () => {
      await renderComponent({
        options: [
          {
            value: 'en',
            label: 'English',
            disabled: true,
          },
        ]
      });
      await checkboxFilter.options(0).click();
    });

    it('should not call onChange callback', () => {
      expect(onChangeHandler.called).to.equal(false);
    });
  });

  describe('when there are selected options', () => {
    beforeEach(async () => {
      await renderComponent({
        selectedValues: ['fr', 'ge'],
      });
    });

    it('should render selected options', () => {
      expect(checkboxFilter.options(1).isSelected).to.equal(true);
      expect(checkboxFilter.options(2).isSelected).to.equal(true);
    });

    describe('after click on unselected option', () => {
      beforeEach(async () => {
        await checkboxFilter.options(0).click();
      });

      it('should raise filter name and new selected values to onChange callback', () => {
        expect(onChangeHandler.args[0]).to.deep.equal([{
          name: 'language',
          values: ['fr', 'ge', 'en'],
        }]);
      });
    });

    describe('after click on selected option', () => {
      beforeEach(async () => {
        await checkboxFilter.options(1).click();
      });

      it('should raise filter name with the remaining selected values to onChange callback', () => {
        expect(onChangeHandler.args[0]).to.deep.equal([{
          name: 'language',
          values: ['ge'],
        }]);
      });
    });
  });
});
