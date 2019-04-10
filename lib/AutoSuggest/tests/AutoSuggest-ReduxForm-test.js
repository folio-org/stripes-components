import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Field } from 'redux-form';

import { mountWithContext } from '../../../tests/helpers';
import AutoSuggestInteractor from './interactor';
import AutoSuggest from '../AutoSuggest';
import TestForm from '../../../tests/TestForm';

const autosuggest = new AutoSuggestInteractor();

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

describe('AutoSuggest in redux-form', () => {
  describe('rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm>
          <Field component={AutoSuggest} name="testfield" label="autoSuggestTest" items={testItems} />
        </TestForm>
      );
    });

    it('renders the component', () => {
      expect(autosuggest.renders).to.be.true;
    });

    it('renders a label', () => {
      expect(autosuggest.labelDisplayed).to.be.true;
    });

    describe('entering an existing value', () => {
      beforeEach(async () => {
        await autosuggest.input.fillValue('b');
      });

      it('opens the suggestion list', () => {
        expect(autosuggest.list.isOpen).to.be.true;
      });

      describe('selecting an option', () => {
        beforeEach(async () => {
          await autosuggest.list.items(0).click();
        });

        it('closes the suggestion list', () => {
          expect(autosuggest.list.isOpen).to.be.false;
        });

        it('sets the value of the input to the selected option', () => {
          expect(autosuggest.input.val).to.equal('book');
        });
      });
    });
  });
});
