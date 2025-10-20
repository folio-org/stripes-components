import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import {
  Button,
  Accordion as AccordionInteractor
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import translations from '../../../translations/stripes-components/en';
import AccordionStatusHarness from './AccordionStatusHarness';

describe('ExpandAll button', () => {
  const keyhandlerExpandButton = Button('Keyhandler expand-all');
  const keyhandlerCollapseButton = Button('Keyhandler collapse-all');
  const expandAllButton = Button(translations.expandAll);
  const collapseAllButton = Button(translations.collapseAll);
  const first = AccordionInteractor({ index: 0 });
  const second = AccordionInteractor({ index: 1 });
  const third = AccordionInteractor({ index: 2 });

  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AccordionStatusHarness />
      );
    });

    it('should render "Collapse all" button', () => collapseAllButton.exists());

    describe('click button to close accordions ', () => {
      beforeEach(async () => {
        await collapseAllButton.click();
      });

      it('should render "Expand all" button', () => expandAllButton.exists());

      describe('click button to open accordions ', () => {
        beforeEach(async () => {
          await expandAllButton.click();
        });

        it('should render "Collapse all" button', () => collapseAllButton.exists());

        describe('Test keyhandler function to collapse all', () => {
          beforeEach(async () => {
            await keyhandlerCollapseButton.click();
          });

          it('should render "Expand all" button', () => expandAllButton.exists());
          it('should collapse all accordions', () => {
            return Promise.all([
              first.is({ open: false }),
              second.is({ open: false }),
              third.is({ open: false })
            ])
          });

          describe('Test keyhandler function to expand all ', () => {
            beforeEach(async () => {
              await keyhandlerExpandButton.click();
            });

            it('should expand all accordions', () => {
              return Promise.all([
                first.is({ open: true }),
                second.is({ open: true }),
                third.is({ open: true })
              ])
            });
          });
        });
      });
    });
  });
});
