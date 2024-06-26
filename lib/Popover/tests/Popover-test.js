/**
 * Popover tests
 */

import React, { useState } from 'react';
import { HTML, Button as ButtonInteractor, runAxeTest } from '@folio/stripes-testing';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../../Button';

import Popover from '../Popover';

const PopoverInteractor = HTML.extend('popover')
  .selector('[data-test-popover-overlay]')
  .actions({
    pressEscape: ({ perform }) => {
      return perform((el) => {
        return el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 27 }));
      });
    }
  });

const ControlledPopoverHarness = () => {
  const [open, setOpen] = useState(true);

  return (
    <Popover
      onToggle={() => setOpen(!open)}
      open={open}
      renderTrigger={({ toggle, ref }) => (
        <Button ref={ref} onClick={toggle} id="trigger-button">
          Toggle
        </Button>
      )}
    >
      Here is some content
    </Popover>
  );
};

describe('Popover', () => {
  const popover = PopoverInteractor();
  const button = ButtonInteractor('Toggle');
  const content = HTML('Hello world');

  beforeEach(async () => {
    await mount(
      <Popover
        renderTrigger={({ toggle, ref }) => (
          <Button ref={ref} onClick={toggle} id="trigger-button">
            Toggle
          </Button>
        )}
      >
        Here is some content
      </Popover>
    );

    await button.click();
  });

  it('contains no axe errors - Popover', runAxeTest);

  it('Renders a trigger button', () => {
    button.exists();
  });

  it('Renders the popover overlay when the trigger is clicked', () => {
    popover.exists();
  });

  describe('Pressing the escape key', () => {
    beforeEach(async () => {
      await PopoverInteractor({ focused: true }).pressEscape();
    });

    it('closes the popover', () => {
      popover.exists();
    });

    it('focuses the trigger', () => {
      button.is({ focused: true });
    });
  });

  describe('If contents is rendered using a render-prop function', () => {
    let hasRenderProps = false;
    beforeEach(async () => {
      await mount(
        <Popover
          renderTrigger={({ toggle, ref }) => (
            <Button ref={ref} onClick={toggle} id="trigger-button">
              Toggle
            </Button>
          )}
        >
          {(renderProps) => {
            hasRenderProps = !!renderProps;
            return <div id="content">Hello world</div>;
          }}
        </Popover>
      );

      await button.click();
    });

    it('Renders the content when trigger is clicked', () => {
      content.exists();
    });

    it('Has render props passed to the render-prop function', () => {
      expect(hasRenderProps).to.be.true;
    });
  });

  describe('If the popover is controlled', () => {
    beforeEach(async () => {
      await mount(
        <ControlledPopoverHarness />
      );

      await button.click();
    });

    it('Renders the popover overlay by default', () => {
      popover.exists();
    });

    it('Closes the popover overlay when the trigger is clicked', () => {
      popover.absent();
    });
  });

  describe.skip('If the legacy component API is used', () => {
    const button2 = ButtonInteractor('Top Popover3');
    beforeEach(async () => {
      await mount(
        <>
          <div id="OverlayContainer" />
          <Popover position="top" alignment="end">
            <Button id="trigger-button" data-role="target">Top Popover3</Button>
            <p data-role="popover">Lorem ipsum delor sit amet...</p>
          </Popover>
        </>
      );

      await button2.click();
    });

    it('Renders the legacy popover and opens the overlay when the toggle is clicked', () => {
      popover.exists();
    });

    describe('When the toggle is clicked again', () => {
      beforeEach(async () => {
        await button2.click();
      });

      it('Hides the popover overlay', () => {
        popover.absent();
      });
    });
  });
});
