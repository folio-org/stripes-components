import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import {
  HTML,
  AutoSuggest as AutoSuggestInteractor,
  Button as InfoPopoverInteractor,
  Selection as SelectionInteractor,
  SelectionList as SelectListInteractor,
  MultiSelect as MultiSelectionInteractor,
  MultiSelectMenu as MultiSelectMenuInteractor,
  Datepicker as DatepickerInteractor,
  Calendar as CalendarInteractor,
  Dropdown as DropdownInteractor,
} from '@folio/stripes-testing';
import { OVERLAY_CONTAINER_ID } from '../../../util/consts';

import { mountWithContext } from '../../../tests/helpers';
import AccordionStatusHarness from './AccordionStatusHarness';

const DropdownOverlay = HTML.extend('dropdown menu')
  .selector('div[class^=DropdownMenu]');

const AutoSuggestOverlay = HTML.extend('autosuggest menu')
  .selector('ul[class^=autoSuggest]');

const InfoPopoverOverlayInteractor = HTML.extend('info popover')
  .selector('[data-test-popover-overlay]');

describe('Accordion Overlay container', () => {
  describe('when accordions are open', () => {
    beforeEach(async () => {
      await mountWithContext(
        <AccordionStatusHarness />
      );
    });

    describe('opening the contained Selection control ', () => {
      beforeEach(async () => {
        await SelectionInteractor().open();
      });

      it('should render the Selection menu in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(SelectListInteractor()).exists());
    });

    describe('opening the contained Multiselection control ', () => {
      beforeEach(async () => {
        await MultiSelectionInteractor().open();
      });

      it('should render the Multiselection menu in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(MultiSelectMenuInteractor()).exists());
    });

    describe('opening the contained Datepicker control ', () => {
      beforeEach(async () => {
        await DatepickerInteractor().openCalendar();
      });

      it('should render the Datepicker calendar in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(CalendarInteractor()).exists());
    });

    describe('opening the contained Dropdown control ', () => {
      beforeEach(async () => {
        await DropdownInteractor().open();
      });

      it('should render the Dropdown\'s menu in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(DropdownOverlay()).exists());
    });
    describe('opening the contained InfoPopover control ', () => {
      beforeEach(async () => {
        await InfoPopoverInteractor({ id: 'infopopover' }).click();
      });

      it('should render the InfoPopover in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(InfoPopoverOverlayInteractor()).exists());
    });
    describe('opening the contained Autosuggest control ', () => {
      beforeEach(async () => {
        await AutoSuggestInteractor().enterFilter('o');
      });

      it('should render the Autosuggest menu in the overlay div', () => HTML({ id: OVERLAY_CONTAINER_ID }).find(AutoSuggestOverlay()).exists());
    });
  });
});
