import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { runAxeTest, HTML, Checkbox, Accordion, including, Button } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import {
  FilterGroupsFirstComponent,
  FilterGroupsSecondComponent,
  FilterGroupsThirdComponent,
  FilterGroupsFourthComponent,
  FilterGroupsFifthComponent,
} from './helpers/filterGroupsUsageTest';

const FilterGroupInteractor = HTML.extend('filter groups')
  .selector('[data-test-filter-groups]')
  .filters({
    sections: (el) => Array.from(el.querySelectorAll('[class^="filterSetHeader--"] [class^="labelArea--"]')).map((l) => l.textContent),
    filterCount: el => el.querySelectorAll('input').length,
  })
  .actions({
    check: ({ find }, label) => find(Checkbox(including(label))).click(),
    toggle: ({ find }, label) => find(Accordion(including(label))).toggle(),
  });

const FilterAccordion = Accordion.extend('filter accordion')
  .filters({
    filterCount: el => el.querySelectorAll('input').length,
    clearButton: Button({ ariaLabel: including('Clear') }).exists()
  })
  .actions({
    clickClearButton: ({ find }, label = 'Clear') => find(Button({ ariaLabel: including(label) })).click(),
  });

describe('Filter Group', () => {
  const filterGroup = FilterGroupInteractor();

  describe('render Filter Group 1 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFirstComponent />
      );
    });

    it('no axe errors: Filter Group', runAxeTest);

    it('render filter group', () => Promise.all([
      filterGroup.exists(),
      Checkbox().exists(),
    ]));

    it('render checkboxes', () => FilterAccordion('Item Types').has({ filterCount: 3 }));

    it('render checkbox label', () => Checkbox('Books').exists());

    it('has no Clear button', () => FilterAccordion('Item Types').has({ clearButton: false }));

    describe('check filter', () => {
      beforeEach(async () => {
        await Checkbox('Books').click();
        await Checkbox('Microfilm').click();
      });

      it('checkbox is checked', () => Promise.all([
        Checkbox('Books').is({ checked: true }),
        Checkbox('DVDs').is({ checked: false }),
        Checkbox('Microfilm').is({ checked: true }),
      ]));

      it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: true }));

      describe('clear all filters', () => {
        beforeEach(async () => {
          await FilterAccordion('Item Types').clickClearButton();
        });

        it('checkboxs are unchecked', () => Promise.all([
          Checkbox('Books').is({ checked: false }),
          Checkbox('DVDs').is({ checked: false }),
          Checkbox('Microfilm').is({ checked: false }),
        ]));

        it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: false }));

        it('toggle is in focus', () => Button('Item Types').is({ focused: true }));
      });
    });
  });
  describe('render Filter Group 2 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsSecondComponent />
      );
    });

    it('render filter group', () => Promise.all([
      filterGroup.exists(),
      Checkbox().exists(),
    ]));

    it('render checkboxes', () => filterGroup.has({ filterCount: 5 }));

    it('render checkbox label', () => Checkbox('Books').exists());

    it('renders correct controls as checked', () => Promise.all([
      Checkbox('Books').is({ checked: true }),
      Checkbox('DVDs').is({ checked: false }),
      Checkbox('Microfilm').is({ checked: true }),
    ]));

    it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: true }));

    describe('clear all filters', () => {
      beforeEach(async () => {
        await FilterAccordion('Item Types').clickClearButton();
      });

      it('checkboxs are unchecked', () => Promise.all([
        Checkbox('Books').is({ checked: false }),
        Checkbox('DVDs').is({ checked: false }),
        Checkbox('Microfilm').is({ checked: false }),
      ]));

      it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: false }));
    });
  });

  describe('render Filter Group 3 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsThirdComponent />
      );
    });

    it('render filter group', () => Promise.all([
      filterGroup.exists(),
      Checkbox().exists(),
    ]));

    it('render correct number of checkboxes', () => FilterAccordion('Item Types').has({ filterCount: 3 }));

    it('render checkbox label', () => Promise.all([
      Checkbox('Books').exists(),
      Checkbox('DVDs').exists(),
      Checkbox('Microfilm').exists()
    ]));

    describe('check filter', () => {
      beforeEach(async () => {
        await Checkbox('Books').click();
      });

      it('filter group has clear button', () => FilterAccordion('Item Types').has({ clearButton: true }));
    });
  });

  describe('render Filter Group 4 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFourthComponent />
      );
    });

    it('render filter group', () => Promise.all([
      filterGroup.exists(),
      Checkbox().exists(),
    ]));

    it('render correct number of checkboxes', () => filterGroup.has({ filterCount: 5 }));

    it('renders correct controls as checked according to config', () => Promise.all([
      Checkbox('Books').is({ checked: true }),
      Checkbox('DVDs').is({ checked: false }),
      Checkbox('Microfilm').is({ checked: true }),
    ]));

    it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: true }));

    describe('clear all filters', () => {
      beforeEach(async () => {
        await FilterAccordion('Item Types').clickClearButton();
      });

      it('has Clear button', () => FilterAccordion('Item Types').has({ clearButton: true }));
    });
  });

  describe('render Filter Group 5 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFifthComponent />
      );
    });

    it('render filter group', () => Promise.all([
      filterGroup.exists(),
      Checkbox().exists(),
    ]));

    it('render correct number of checkboxes', () => filterGroup.has({ filterCount: 5 }));
  });
});
