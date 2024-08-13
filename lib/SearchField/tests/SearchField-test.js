import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { SearchField as Interactor, runAxeTest, TextInput, TextArea, Label } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import SearchField from '../SearchField';

const LABEL_PUBLISHER = 'Publisher';
const LABEL_SUBJECT = 'Subject';
const PLACEHOLDER_SUBJECT = 'Subject...';

const ariaLabelFilters = {
  ariaLabel: (el) => el.getAttribute('aria-label')
};
const AriaTextInput = TextInput.extend('aria text input')
  .filters(ariaLabelFilters);

describe('SearchField', () => {
  const searchField = Interactor();

  describe('rendering a SearchField', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SearchField aria-label="test search" id="searchFieldTest" />
      );
    });

    it('contains no axe errors - SearchField', runAxeTest);

    it('applies the supplied id prop to the input', () => searchField.has(
      {
        id: 'searchFieldTest',
        readOnly: false
      }
    ));

    it('applies aria-label to search field', () => AriaTextInput({ ariaLabel: 'test search' }).exists());
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
          disabled: true
        }
      ));
    });
  });

  describe('supplying an inputType="textarea"', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SearchField
          ariaLabel="test search field"
          id="searchFieldTest"
          inputType="textarea"
        />
      );
    });

    it('renders aria label on textArea', () => TextArea({ ariaLabel: 'test search field' }).exists());

    describe('changing the field', () => {
      beforeEach(async () => {
        await searchField.fillIn('testing text');
      });

      it('should update value', () => searchField.has({ value: 'testing text' }));
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
        disabled: false,
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

  describe('when both searchableIndexes and searchableOptions are passed', () => {
    const searchableIndexes = [
      { label: LABEL_SUBJECT, value: 'subject', placeholder: PLACEHOLDER_SUBJECT },
    ];

    const searchableOptions = (
      <optgroup label="Fruits">
        <option value="Watermelon">watermelon</option>
      </optgroup>
    );

    beforeEach(async () => {
      await mountWithContext(
        <SearchField
          id="searchFieldTest"
          searchableIndexes={searchableIndexes}
          searchableOptions={searchableOptions}
        />
      );
    });

    it('should not render options from searchableIndexes', () => searchField.perform(el => {
      expect(el.querySelector(`option[value="${LABEL_SUBJECT}"]`)).to.be.null;
    }));
  });

  describe('when searchableOptions is passed', () => {
    const searchableOptions = (
      <optgroup label="Options">
        <option value="option1">Option1</option>
        <option value="option2">Option2</option>
      </optgroup>
    );

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
            id="testSearchField"
            onChangeIndex={(e) => { this.setState({ searchFieldIndex: e.target.value }); }}
            searchableOptions={searchableOptions}
            selectedIndex={this.state.searchFieldIndex}
            indexLabel="test index label"
          />
        );
      }
    }

    beforeEach(async () => {
      await mountWithContext(
        <SearchFieldHarness />
      );
    });

    it('should not render startControlElement', () => searchField.perform(el => {
      expect(el.querySelector('div[class^="startControls---"]')).to.be.null;
    }));

    it('renders index select with provided aria-label', () => Label('test index label').has({ visible: false }));

    describe('changing the index', () => {
      beforeEach(async () => {
        await searchField.selectIndex('Option2');
      });

      it('should select a new option', () => searchField.has({ selectedFilter: 'option2' }));
    });
  });
});
