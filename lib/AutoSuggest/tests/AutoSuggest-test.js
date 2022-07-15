import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { AutoSuggest as Interactor, runAxeTest } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import AutoSuggest from '../AutoSuggest';

const testItems = [
  {
    value: 'book',
    label: 'Book',
  },
  {
    value: 'cd',
    label: 'CD',
  },
  {
    value: 'ebook',
    label: 'eBook',
  },
  {
    value: 'vinyl',
    label: 'Vinyl',
  },
  {
    value: 'audiobook',
    label: 'Audiobook',
  },
];

describe('AutoSuggest', () => {
  const autosuggest = Interactor('autoSuggestTest');
  // stub test for legacy coverage
  describe('rendering legacy (tether)', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoSuggest label="autoSuggestTest" items={testItems} tether={{}} />
      );
    });

    it('has no axe errors', runAxeTest);

    it('renders the component', async () => {
      await autosuggest.exists();
    });
  });
  // end stub test for legacy.
  describe('rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoSuggest label="autoSuggestTest" items={testItems} />
      );
    });

    it('renders the component', async () => {
      await autosuggest.exists();
    });

    describe('entering an existing value', () => {
      beforeEach(async () => {
        await autosuggest.enterFilter('b');
      });

      it('opens the suggestion list', async () => {
        await autosuggest.is({ open: true });
      });

      it('has no axe errors - open list', runAxeTest);

      describe('selecting an option', () => {
        beforeEach(async () => {
          await autosuggest.select('book');
        });

        it('closes the suggestion list', async () => {
          await autosuggest.is({ open: false });
        });

        it('sets the value of the input to the selected option', async () => {
          await autosuggest.has({ value: 'book' });
        });
      });
    });
  });
});
