import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';
import MultiSelectionFilter from '../MultiSelectionFilter';

import MultiSelectionInteractor from '../../MultiSelection/tests/interactor';

const multiSelectionFilter = new MultiSelectionInteractor();

const options = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ge', label: 'German' },
  { value: 'it', label: 'Italian' },
];

describe('MultiSelectionFilter', () => {
  const onChangeHandler = sinon.spy();

  beforeEach(async () => {
    await mountWithContext(
      <MultiSelectionFilter
        name="language"
        options={options}
        onChange={onChangeHandler}
      />
    );

    onChangeHandler.resetHistory();
  });

  it('should not render any selected values by default', () => {
    expect(multiSelectionFilter.values()).to.deep.equal([]);
  });

  describe('when there are selected values', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MultiSelectionFilter
          name="language"
          selectedValues={['en', 'fr', 'ge']}
          options={options}
          onChange={onChangeHandler}
        />
      );
    });

    it('should display selected values', () => {
      expect(multiSelectionFilter.values(0).valLabel).to.equal('English');
      expect(multiSelectionFilter.values(1).valLabel).to.equal('French');
      expect(multiSelectionFilter.values(2).valLabel).to.equal('German');
    });

    describe('after click on a value delete button', () => {
      beforeEach(async () => {
        await multiSelectionFilter.values(0).clickRemoveButton();
      });

      it('should call onChange callback with filter name and rest values', () => {
        expect(onChangeHandler.args[0]).to.deep.equal([{
          name: 'language',
          values: ['fr', 'ge'],
        }]);
      });
    });

    describe('after click on selected option', () => {
      beforeEach(async () => {
        await multiSelectionFilter.options(1).clickOption();
      });

      it('should call onChange callback with filter name and rest values', () => {
        expect(onChangeHandler.args[0]).to.deep.equal([{
          name: 'language',
          values: ['en', 'ge']
        }]);
      });
    });

    describe('after click on unselected option', () => {
      beforeEach(async () => {
        await multiSelectionFilter.options(3).clickOption();
      });

      it('should pass filter name and all selected values to onChange callback', () => {
        expect(onChangeHandler.args[0]).to.deep.equal([{
          name: 'language',
          values: ['en', 'fr', 'ge', 'it'],
        }]);
      });
    });
  });
});
