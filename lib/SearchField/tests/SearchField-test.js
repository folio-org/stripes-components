import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { SearchField as Interactor } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import SearchField from '../SearchField';

const LABEL_PUBLISHER = 'Publisher';
const LABEL_SUBJECT = 'Subject';
const PLACEHOLDER_SUBJECT = 'Subject...';

describe('SearchField', () => {
  const searchField = Interactor();

  describe('rendering a SearchField', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SearchField id="searchFieldTest" />
      );
    });

    it('applies the supplied id prop to the input', () => searchField.has(
      {
        id: 'searchFieldTest',
        readOnly: false
      }
    ));
  });

  describe('supplying an onChange handler', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SearchField
          id="searchFieldTest"
        />
      );
    });

    describe('changing the field', () => {
      beforeEach(async () => {
        await searchField.fillIn('testing text');
      });

      it('should update value', () => searchField.has({ value: 'testing text' }));
    });

    describe('rendering a SearchField in loading state', () => {
      beforeEach(async () => {
        await mountWithContext(
          <SearchField
            id="searchFieldTest"
            loading
            searchableIndexes={[{ label: 'ID', value: 'id' }]}
          />
        );
      });

      it('input and select are disabled', () => searchField.has(
        {
          readOnly: true,
          isDisabled: true
        }
      ));
    });
  });

  describe('using with indexes', () => {
    const searchableIndexes = [
      { label: 'ID', value: 'id' },
      { label: 'Title', value: 'title' },
      { label: 'Identifier', value: 'identifier' },
      { label: 'ISBN', value: 'identifier/type=isbn' },
      { label: 'ISSN', value: 'identifier/type=issn' },
      { label: 'Contributor', value: 'contributor' },
      { label: LABEL_SUBJECT, value: 'subject', placeholder: PLACEHOLDER_SUBJECT },
      { label: 'Classification', value: 'classification' },
      { label: LABEL_PUBLISHER, value: 'publisher' },
    ];

    class SearchFieldHarness extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          searchFieldIndex: 'identifier',
        };
      }

      render() {
        return (
          <SearchField
            onChangeIndex={(e) => { this.setState({ searchFieldIndex: e.target.value }); }}
            searchableIndexes={searchableIndexes}
            selectedIndex={this.state.searchFieldIndex}
          />
        );
      }
    }

    beforeEach(async () => {
      await mountWithContext(
        <SearchFieldHarness />
      );
    });

    it('select is not disabled', () => searchField.has(
      {
        isDisabled: false,
      }
    ));

    describe('changing the index', () => {
      beforeEach(async () => {
        await searchField.selectIndex(LABEL_PUBLISHER);
      });

      it('should update the placeholder', () => searchField.has({ placeholder: '' }));
    });

    describe('changing the index with placeholder', () => {
      beforeEach(async () => {
        await searchField.selectIndex(LABEL_SUBJECT);
      });

      it('should update the placeholder', () => searchField.has({ placeholder: PLACEHOLDER_SUBJECT }));
    });
  });
});
