import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { AutoSuggest as Interactor, converge, runAxeTest, HTML } from '@folio/stripes-testing';
import { RoledHTML } from '../../../tests/helpers/localInteractors';
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
  const onChange = sinon.spy();
  describe('rendering', () => {
    beforeEach(async () => {
      await onChange.resetHistory();
      await mountWithContext(
        <AutoSuggest
          label="autoSuggestTest"
          items={testItems}
          onChange={onChange}
        />
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

      it('calls the onChange handler with selected value', async () => {
        await converge(() => { if (!onChange.calledWith('b')) throw new Error('Expected onChange handler to be called with value "b"') });
      });

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

        it('calls the onChange handler with selected value', async () => {
          await converge(() => { if (!onChange.calledWith('book')) throw new Error('Expected onChange handler to be called with value "book"') });
        });
      });
    });
  });

  describe('rendering with pre-existing value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AutoSuggest
          label="autoSuggestTest"
          items={testItems}
          value="audiobook"
        />
      );
    });

    it('presents value', async () => {
      await autosuggest.has({ value: 'audiobook' });
    });

    describe('selecting a different value', () => {
      beforeEach(async () => {
        await autosuggest.fillIn('');
        await autosuggest.select('ebook');
      });


      it('presents value', async () => {
        await autosuggest.has({ value: 'ebook' });
      });
    });
  })

  describe('usePortal prop', () => {
    beforeEach(async () => {
      await mountWithContext(
        <>
          <div id="OverlayContainer" />
          <AutoSuggest
            label="autoSuggestTest"
            items={testItems}
            value="book"
            usePortal
          />
        </>
      );
      await autosuggest.enterFilter('b');
    });

    it('renders menu to overlay element', () => HTML({ id: 'OverlayContainer' }).find(RoledHTML({ tagName:'UL' })).exists())
  });
});
