import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import CurrencySelect from '../CurrencySelect';
import CurrencySelectInteractor from './interactor';

describe('CurrencySelect', () => {
  const cs = new CurrencySelectInteractor();

  describe('rendering a button', () => {
    beforeEach(async () => {
      await mount(
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
});
