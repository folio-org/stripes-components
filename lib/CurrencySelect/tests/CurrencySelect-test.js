import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Select as CurrencySelectInteractor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import {
  currenciesByCode,
  currenciesByName,
  currenciesByNumber,
  currenciesOptions,
} from '../../util/currencies';

import CurrencySelect from '../CurrencySelect';

describe('CurrencySelect', () => {
  const cs = new CurrencySelectInteractor();

  describe('rendering a Select', () => {
    beforeEach(async () => {
      await mountWithContext(
        <CurrencySelect id="currency-select-test" />
      );
    });

    it('renders a select element', () => {
      cs.exists();
    });

    it('applies the id to the select', () => {
      cs.has({ id: 'currency-select-test' });
    });
  });

  describe('utility functions', () => {
    const CURRENCY_COUNT = 159;
    it('expects currency maps to contain the same element counts (reduce by CODE)', () => {
      expect(Object.keys(currenciesByCode).length).to.equal(CURRENCY_COUNT);
    });

    // this test fails with currency-codes v2.2.0 which supplies duplicate
    // entries for Bolívar Soberano. it isn't clear if this is intentional
    // (and so this map-by-name function should never have been written) or
    // accidental (names are unique in previous releases).
    //
    // if we unpin the dependency from v2.1.0 then we need to remove this function,
    // a breaking change. leave comments at STCOM-1379.
    it('expects currency maps to contain the same element counts (reduce by NAME)', () => {
      expect(Object.keys(currenciesByName).length).to.equal(CURRENCY_COUNT);
    });

    it('expects currency maps to contain the same element counts (reduce by NUMBER)', () => {
      expect(Object.keys(currenciesByNumber).length).to.equal(CURRENCY_COUNT);
    });

    it('expects currency maps to contain the same element counts', () => {
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
