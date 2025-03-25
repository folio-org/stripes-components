import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';

import { AutoSuggest as Interactor, converge, runAxeTest, HTML } from '@folio/stripes-testing';

import { RoledHTML } from '../../../tests/helpers/localInteractors';
import { mountWithContext } from '../../../tests/helpers';
import AutoSuggest, {
  defaultIncludeItem,
  defaultRender,
  getObjectFromValue
} from '../AutoSuggest';

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

describe.only('AutoSuggest', () => {
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

  describe('defaultIncludeItem', () => {
    describe('when item.value contains search string', () => {
      it('returns true', () => {
        // now you, too, will hear hoMEOWner in your head every time you read it
        expect(defaultIncludeItem({ value: 'homeowner' }, 'meow')).to.be.true;
      });
    });

    describe('when item.value does not contain search string', () => {
      it('returns false', () => {
        expect(defaultIncludeItem({ value: 'homeowner' }, 'woof')).to.be.false;
      });
    })

    describe('when item.value is undefined', () => {
      it('returns false', () => {
        expect(defaultIncludeItem({ nothing: 'gourmet' }, 'toothpaste')).to.be.false;
      });
    });
  });

  describe('defaultRender', () => {
    it('returns item\'s value attribute when item is non-empty', () => {
      const value = 'monkeys';
      expect(defaultRender({ value })).to.equal(value);
    });

    it('returns empty string when item is falsy', () => {
      expect(defaultRender()).to.equal('');
    });
  });

  describe('getObjectFromValue', () => {
    it('returns first matching item', () => {
      const key = 'key';
      const val = 'rogue 1';
      const i0 = { [key]: 'rogue 0' };
      const i1 = { [key]: 'rogue 1' };
      const i2 = { [key]: 'rogue 2' };

      const items = [i0, i1, i2];
      expect(getObjectFromValue(val, key, items)).to.deep.equal(i1);
    });

    it('returns undefined if there are no matches', () => {
      const key = 'verghese';
      const i0 = { [key]: 'cutting for stone' };
      const i1 = { [key]: 'covenant of water' };

      const items = [i0, i1];
      expect(getObjectFromValue('little no horse', key, items)).to.be.undefined;
      expect(getObjectFromValue('four winds', 'hannah', items)).to.be.undefined;
    });

    it('returns undefined if the list is empty', () => {
      const key = 'does not';

      expect(getObjectFromValue('matter', key, [])).to.be.undefined;
    });
  });
});
