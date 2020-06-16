import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import {
  currenciesByCode,
  currenciesByName,
  currenciesByNumber,
  currenciesOptions,
} from '../../../util/currencies';

import CurrencySelect from '../CurrencySelect';
import CurrencySelectInteractor from './interactor';

describe('CurrencySelect', () => {
  const cs = new CurrencySelectInteractor();

  describe('rendering a Select', () => {
    beforeEach(async () => {
      await mountWithContext(
        <CurrencySelect id="currency-select-test" />
      );
    });

    it('renders a select element', () => {
      expect(cs.hasSelect).to.be.true;
    });

    it('applies the id to the select', () => {
      expect(cs.id).to.equal('currency-select-test');
    });
  });

  describe('utility functions', () => {
    const CURRENCY_COUNT = 160;
    it('expects currency maps to contain the same element counts', () => {
      expect(Object.keys(currenciesByCode).length).to.equal(CURRENCY_COUNT);
      expect(Object.keys(currenciesByName).length).to.equal(CURRENCY_COUNT);
      expect(Object.keys(currenciesByNumber).length).to.equal(CURRENCY_COUNT);
      expect(currenciesOptions.length).to.equal(CURRENCY_COUNT);
    });

    it('expects to find US Dollars', () => {
      expect(currenciesByCode.USD).to.not.be.null;
    });

    it('expects to find Euros', () => {
      expect(currenciesByCode.EUR).to.not.be.null;
    });

    describe('utility functions to have certain attributes', () => {
      it('expects currency maps to contain certain the attribute "code"', () => {
        expect(typeof currenciesByCode.USD.code).to.equal('string');
      });
      it('expects currency maps to contain certain the attribute "number"', () => {
        expect(typeof currenciesByCode.USD.number).to.equal('string');
      });
      it('expects currency maps to contain certain the attribute "currency"', () => {
        expect(typeof currenciesByCode.USD.currency).to.equal('string');
      });
    });
  });
});
