import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import {
  Button
} from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import AccordionStatus from '../AccordionStatus';
import ExpandAllButton from '../ExpandAllButton';
import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import translations from '../../../translations/stripes-components/en';

describe('ExpandAll button', () => {
  const expandAllButton = Button(translations.expandAll);
  const collapseAllButton = Button(translations.collapseAll);

  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mount(
        <AccordionStatus>
            <ExpandAllButton
              collapseLabel={translations.collapseAll}
              expandLabel={translations.expandAll}
              id="expand-button"
            />
            <AccordionSet closedByDefault id="testSet">
              <Accordion
                label="test"
                id="accordion01"
                closedByDefault
              >
                <input />
              </Accordion>
              <Accordion
                label="test"
                id="accordion02"
              >
                <input />
              </Accordion>
              <Accordion
                label="test"
                id="accordion03"
              >
                <input />
              </Accordion>
            </AccordionSet>
          </AccordionStatus>
      );
    });

    it('should render "Collapse all" button', async () => await collapseAllButton.exists());

    describe('click button to close accordions ', () => {
      beforeEach(async () => {
        await collapseAllButton.click();
      });

      it('should render "Expand all" button', async () => await expandAllButton.exists());

      describe('click button to close accordions ', () => {
        beforeEach(async () => {
          await expandAllButton.click();
        });

        it('should render "Collapse all" button', async () => await collapseAllButton.exists());
      });
    });
  });
});
