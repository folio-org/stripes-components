import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Accordion as Interactor, Keyboard } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import ExpandAllExample from '../../Accordion/stories/collapseAccordionUsage';

describe('Accordion centralized shortcuts', () => {
  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mount(
        <ExpandAllExample />
      );
    });

    describe('using the expand-all shortcut', () => {
      beforeEach(async () => {
        await Interactor({ index: 0 }).focus();
        await Keyboard.pressKey('Control');
        await Keyboard.pressKey('Alt');
        await Keyboard.pressKey('b');
      });

      it('opens all accordions', async () => {
        await Interactor({ open: true });
      });
    });

    describe('using the expand-all shortcut', () => {
      beforeEach(async () => {
        await Interactor({ index: 0 }).focus();
        await Keyboard.pressKey('Control');
        await Keyboard.pressKey('Alt');
        await Keyboard.pressKey('g');
      });

      it('closes all accordions', async () => {
        await !Interactor({ open: true });
      });
    });
  });
});
