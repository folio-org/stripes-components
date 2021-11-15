import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import CountrySelection from '../CountrySelection';
import SelectionInteractor from '../../Selection/tests/interactor';

describe('CountrySelection', () => {
  const si = new SelectionInteractor();

  describe('rendering a Selection', () => {
    beforeEach(async () => {
      await mountWithContext(
        <CountrySelection id="country-select-test" />
      );
    });

    it('applies the id to the container', () => {
      expect(si.controlId).to.equal('country-select-test');
    });
  });
});
