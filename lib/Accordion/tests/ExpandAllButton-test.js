import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';
import ExpandAllExample from '../stories/collapseAccordionUsage';
import ExpandAllButtonInteractor from './expand-all-button-interactor';
import translations from '../../../translations/stripes-components/en';

describe('ExpandAll button', () => {
  const expandAllButton = new ExpandAllButtonInteractor();

  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mount(
        <ExpandAllExample />
      );
    });

    it('should exist button', () => {
      expect(expandAllButton.hasButton).to.be.true;
    });

    it('should have id', () => {
      expect(expandAllButton.id).to.equal('expand-button');
    });

    it('button label should be equals', () => {
      expect(expandAllButton.label).to.equal(translations.collapseAll);
    });

    describe('click button to close accordions ', () => {
      beforeEach(async () => {
        await expandAllButton.clickExpandAllButton();
      });

      it('should exist button', () => {
        expect(expandAllButton.hasButton).to.be.true;
      });

      it('button label should be equals', () => {
        expect(expandAllButton.label).to.equal(translations.expandAll);
      });

      describe('click button to close accordions ', () => {
        beforeEach(async () => {
          await expandAllButton.clickExpandAllButton();
        });

        it('should exist button', () => {
          expect(expandAllButton.hasButton).to.be.true;
        });

        it('button label should be equals', () => {
          expect(expandAllButton.label).to.equal(translations.collapseAll);
        });
      });
    });
  });
});
