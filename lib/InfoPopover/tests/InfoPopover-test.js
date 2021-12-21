/**
 * InfoPopover tests
 */

import React from 'react';
import { Interactor } from '@bigtest/interactor';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import Harness from '../../../tests/Harness';
import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import ButtonInteractor from '../../Button/tests/interactor';

import InfoPopover from '../InfoPopover';
import InfoPopoverInteractor from './interactor';

describe('InfoPopover', () => {
  const infoPopover = new InfoPopoverInteractor();
  const customTrigger = new ButtonInteractor('#custom-trigger');
  const content = new Interactor('#content');

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

    await infoPopover.triggerButton.click();
  });

  it('Renders the default trigger button', () => {
    expect(infoPopover.triggerButton.isPresent).to.be.true;
  });

  it('Should render the contents of the info popover', () => {
    expect(content.isPresent).to.be.true;
  });

  it('Should NOT render a button inside the info popover by default', () => {
    expect(infoPopover.button.isPresent).to.be.false;
  });

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

      await infoPopover.triggerButton.click();
    });

    it('Should render a button inside the info popover by default', () => {
      expect(infoPopover.button.isPresent).to.be.true;
    });

    describe('When the hideOnButtonClick-prop is true and the button is clicked', () => {
      beforeEach(async () => {
        await infoPopover.button.click();
      });

      it('Should close the info popover', () => {
        expect(infoPopover.content.isPresent).to.be.false;
      });
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

    it('Should render the custom trigger button passed to renderTrigger', () => {
      expect(customTrigger.isPresent).to.be.true;
    });

    describe('When the hideOnButtonClick-prop is false and the button is clicked', () => {
      beforeEach(async () => {
        await infoPopover.button.click();
      });

      it('Should remain open', () => {
        expect(infoPopover.content.isPresent).to.be.true;
      });
    });
  });
});
