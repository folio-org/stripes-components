import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Selection as SelectionInteractor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import CountrySelection from '../CountrySelection';

describe('CountrySelection', () => {
  const selection = SelectionInteractor();

  describe('rendering a Selection', () => {
    beforeEach(async () => {
      await mountWithContext(
        <CountrySelection id="country-select-test" />
      );
    });

    it('applies the id to the container', () => {
      selection.has({ id: 'country-select-test' });
    });
  });
});
