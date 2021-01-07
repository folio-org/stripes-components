import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import ExpandAllExample from '../../Accordion/stories/collapseAccordionUsage';
import { AccordionSetInteractor } from '../../Accordion/tests/interactor';
import KeyboardInteractor from './KeyboardInteractor';

describe('Accordion centralized shortcuts', () => {
  const accordionSet = new AccordionSetInteractor();
  const kb = new KeyboardInteractor('button');
  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mount(
        <ExpandAllExample />
      );
    });

    describe('using the expand-all shortcut', () => {
      beforeEach(async () => {
        await kb.focus();
        await kb.pressCtrl();
        await kb.pressAlt();
        await kb.expandAll();
      });

      it('opens all accordions', () => {
        accordionSet.set().forEach((a) => {
          expect(a.isOpen).to.be.true;
        });
      });
    });

    describe('using the expand-all shortcut', () => {
      beforeEach(async () => {
        await kb.focus();
        await kb.pressCtrl();
        await kb.pressAlt();
        await kb.collapseAll();
      });

      it('closes all accordions', () => {
        accordionSet.set().forEach((a) => {
          expect(a.isOpen).to.be.false;
        });
      });
    });
  });
});
