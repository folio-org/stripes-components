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
  .selector('[data-test-info-popover]');

describe('InfoPopover', () => {
  const infoPopover = new InfoPopoverInteractor();
  const customTrigger = ButtonInteractor({ id: 'custom-trigger' });
  const content = HTML({ id: 'content' });

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

    await Button().click();
  });

  it('Renders the default trigger button', () => ButtonInteractor().exists());

  it('Should render the contents of the info popover', () => InfoPopoverInteractor('Here is some content'));

  it('Should NOT render a button inside the info popover by default', () => content.find(Button()).absent());

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

      await Button().click();
    });

    it('Should render a button inside the info popover by default', () => content.find(Button()).exists());

    it('should have no axe errors - InfoPopover: href prop', runAxeTest);

    describe('When the hideOnButtonClick-prop is true and the button is clicked', () => {
      beforeEach(async () => {
        await infoPopover.button.click();
      });

      it('Should close the info popover', () => content.exists());
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
        await customTrigger.click();
      });

      it('Should remain open', () => content.exists());
    });
  });
});
