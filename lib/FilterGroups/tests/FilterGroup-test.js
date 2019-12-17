import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import FilterGroupInteractor from './interactor';
import FilterGroupsFirstComponent from '../stories/filterGroupsUsageTest1';
import FilterGroupsSecondComponent from '../stories/filterGroupsUsageTest2';
import FilterGroupsThirdComponent from '../stories/filterGroupsUsageTest3';
import FilterGroupsFourthComponent from '../stories/filterGroupsUsageTest4';

describe.only('Filter Group', () => {
  const filterGroupInteractor = new FilterGroupInteractor();

  describe('render Filter Group First component', () => {
    beforeEach(async () => {
      await mount(
        <FilterGroupsFirstComponent />
      );
    });

    it('render filter group ', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes ', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(3);
    });

    it('render checkbox label ', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
    });

    it('has not Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.false;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal("Item Types");
    });

    it('span wrapper has class for checked checkbox', () => {
      expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
    });

    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('checkbox is checked', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.true;
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
  });

  describe('render Filter Group Second component', () => {
    beforeEach(async () => {
      await mount(
        <FilterGroupsSecondComponent />
      );
    });

    it('render filter group ', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes ', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(3);
    });

    it('render checkbox label ', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
    });

    it('has not Clear button', () => {
      expect(filterGroupInteractor.hasClearButton).to.be.false;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal("Item Types");
    });

    it('span wrapper has class for checked checkbox', () => {
      expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
    });
  
    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('checkbox is checked', () => {
        expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.true;
      });

      it('checkbox is checked and has label', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
        expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      });

      it('has Clear button', () => {
        expect(filterGroupInteractor.hasClearButton).to.be.true;
      });

      describe('clear all filters', () => {
        beforeEach(async () => {
          await filterGroupInteractor.clickClearButton();
        });

        it('span wrapper has class for checked checkbox', () => {
          expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
        });

        it('checkbox is checked', () => {
          expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
        });

        it('has Clear button', () => {
          expect(filterGroupInteractor.hasClearButton).to.be.false;
        });
      });
    });
  });
  describe('render Filter Group Third component', () => {
    beforeEach(async () => {
      await mount(
        <FilterGroupsThirdComponent />
      );
    });

    it('render filter group ', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes ', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(5);
    });

    it('render checkbox label ', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal("Item Types");
    });

    it('span wrapper has class for checked checkbox', () => {
      expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
    });
  
    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('span wrapper has class for checked checkbox', () => {
        expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
      });

      it('checkbox is checked and has label', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
        expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      });


      // describe('clear all filters', () => {
      //   beforeEach(async () => {
      //     await filterGroupInteractor.clickClearButton();
      //   });

      //   it('span wrapper has class for checked checkbox', () => {
      //     expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
      //   });

      //   it('has Clear button', () => {
      //     expect(filterGroupInteractor.hasClearButton).to.be.false;
      //   });
      // });
    });
  });

  describe('render Filter Group Fourth component', () => {
    beforeEach(async () => {
      await mount(
        <FilterGroupsFourthComponent />
      );
    });

    it('render filter group ', () => {
      expect(filterGroupInteractor.hasControlGroup).to.be.true;
      expect(filterGroupInteractor.hasFilterCheckbox).to.be.true;
    });

    it('render checkboxes ', () => {
      expect(filterGroupInteractor.checkboxes().length).to.equal(5);
    });

    it('render checkbox label ', () => {
      expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
      expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      expect(filterGroupInteractor.checkboxes(0).isChecked).to.be.false;
    });

    it('filter is inside accordion', () => {
      expect(filterGroupInteractor.hasFilterAccordion).to.be.true;
    });

    it('filter is expanded', () => {
      expect(filterGroupInteractor.isFilterGroupVisible).to.be.true;
    });

    it('filter group heading is', () => {
      expect(filterGroupInteractor.filterHeading).to.equal("Item Types");
    });

    it('span wrapper has class for checked checkbox', () => {
      expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
    });
  
    describe('check filter', () => {
      beforeEach(async () => {
        await filterGroupInteractor.checkboxes(0).clickInput();
      });

      it('span wrapper has class for checked checkbox', () => {
        expect(filterGroupInteractor.isCheckboxSpanWrapperChecked).to.be.false;
      });

      it('checkbox is checked and has label', () => {
        expect(filterGroupInteractor.checkboxes(0).hasLabelElement).to.be.true;
        expect(filterGroupInteractor.checkboxes(0).label).to.equal('Books');
      });
    });
  });
});
