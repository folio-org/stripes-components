/**
 * InfoPopover tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, HTML, Button as ButtonInteractor } from '@folio/stripes-testing';

import Harness from '../../../tests/Harness';
import { mount } from '../../../tests/helpers';

import Button from '../../Button';

import InfoPopover from '../InfoPopover';

const InfoPopoverInteractor = HTML.extend('info popover')
  .selector('[data-test-popover-overlay]')
  .filters({
    button: (el) => !!el.querySelector('button, a')
  });

describe('InfoPopover', () => {
  const infoPopover = InfoPopoverInteractor();
  const customTrigger = ButtonInteractor({ id: 'custom-trigger' });

  beforeEach(async () => {
    await mount(
      <InfoPopover
        content={
          <div id="content">
            Here is some content
          </div>
        }
      />
    );

    await ButtonInteractor().click();
  });

  it('Renders the default trigger button', () => ButtonInteractor().exists());

  it('Should render the contents of the info popover', () => InfoPopoverInteractor('Here is some content'));

  it('Should NOT render a button inside the info popover by default', () => infoPopover.has({ button: false }));

  it('should have no axe errors - InfoPopover', runAxeTest);

  describe('If a buttonHref-prop is passed', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <InfoPopover
            content="Some content"
            buttonHref="/some-url"
            hideOnButtonClick
          />
        </Harness>
      );

      await ButtonInteractor().click();
    });

    it('Should render a button inside the info popover by default', () => infoPopover.has({ button: true }));

    it('should have no axe errors - InfoPopover: href prop', runAxeTest);

    describe('When the hideOnButtonClick-prop is true and the button is clicked', () => {
      beforeEach(async () => {
        await infoPopover.find(ButtonInteractor()).click();
      });

      it('Should close the info popover', () => infoPopover.absent());
    });
  });

  describe('If the renderTrigger prop is passed', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <InfoPopover
            renderTrigger={({ ref, toggle }) => (
              <Button ref={ref} onClick={toggle} id="custom-trigger">
                Toggle
              </Button>
            )}
            content="Some content"
            buttonHref="/some-url"
            hideOnButtonClick={false}
          />
        </Harness>
      );

      await customTrigger.click();
    });

    it('Should render the custom trigger button passed to renderTrigger', () => customTrigger.exists());

    describe('When the hideOnButtonClick-prop is false and the button is clicked', () => {
      beforeEach(async () => {
        await infoPopover.perform(el => el.querySelector('a').click());
      });

      it('Should remain open', () => infoPopover.exists());
    });
  });
});
