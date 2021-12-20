import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import FilterGroupInteractor from './interactor';
import {
  FilterGroupsFirstComponent,
  FilterGroupsSecondComponent,
  FilterGroupsThirdComponent,
  FilterGroupsFourthComponent,
  FilterGroupsFifthComponent,
} from './helpers/filterGroupsUsageTest';

describe('Filter Group', () => {
  const filterGroupInteractor = new FilterGroupInteractor();

  describe('render Filter Group 1 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFirstComponent />
      );
    });

    it('render filter group', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(3);
    });

    it('render checkbox label', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
    });

    it('has not Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.false;
    });

    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
        await filterGroupInteractor.checkboxes(2).clickInput();
      });

      it('checkbox is checked', () => {
        expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
        expect(filterGroupInteractor.checkboxes(2).isChecked).to.be.true;
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.true;
      });

      describe('clear all filters', () => {
        beforeEach(async () => {
          await filterGroupInteractor.clickClearButton();
        });

        it('checkbox is checked', () => {
          expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
          expect(filterGroupInteractor.checkboxes(2).isChecked).to.be.false;
        });

        it('has Clear button', () => {
          expect(filterGroupInteractor.hasClearButton).to.be.false;
        });
      });
    });
  });
  describe('render Filter Group 2 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsSecondComponent />
      );
    });

    it('render filter group', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(5);
    });

    it('render checkbox label', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
      expect(filterGroupInteractor.checkboxes(2).isChecked).to.be.true;
    });

    it('span wrapper has class for checked checkbox', () => {
      expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
    });

    it('has Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.true;
    });

    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
        await filterGroupInteractor.checkboxes(2).clickInput();
      });

      it('span wrapper has class for checked checkbox', () => {
        expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
      });
    });

    describe('clear all filters', () => {
      beforeEach(async () => {
        await filterGroupInteractor.clickClearButton();
      });

      it('span wrapper has class for checked checkbox', () => {
        expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.false;
      });
    });
  });

  describe('render Filter Group 3 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsThirdComponent />
      );
    });

    it('render filter group', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(3);
    });

    it('render checkbox label', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal('Item Types');
    });

    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('checkbox is checked and has label', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
        expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      });
    });
  });

  describe('render Filter Group 4 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFourthComponent />
      );
    });

    it('render filter group', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(5);
    });

    it('render checkbox label', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
      expect(filterGroupInteractor.checkboxes(2).isChecked).to.be.true;
    });

    it('has Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.true;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal('Item Types');
    });

    describe('clear all filters', () => {
      beforeEach(async () => {
        await filterGroupInteractor.clickClearButton();
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.true;
      });
    });
  });
  describe('render Filter Group 5 component', () => {
    beforeEach(async () => {
      await mountWithContext(
        <FilterGroupsFifthComponent />
      );
    });

    it('render filter group', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(5);
    });

    it('render checkbox label', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
      expect(filterGroupInteractor.checkboxes(2).isChecked).to.be.true;
    });

    it('has Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.true;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal('Item Types');
    });

    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('checkbox is checked and has label', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
        expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      });
    });

    describe('clear all filters', () => {
      beforeEach(async () => {
        await filterGroupInteractor.clickClearButton();
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.true;
      });
    });
  });
});
