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
      return perform(() => {
        return document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true, cancelable: true, key: 'Escape', keyCode: 27,
        }));
      });
    },
    pressTab: ({ perform }) => {
      return perform(() => {
        return document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true, cancelable: true, key: 'Tab', keyCode: 9,
        }));
      });
    },
    pressShiftTab: ({ perform }) => {
      return perform(() => {
        return document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true, cancelable: true, key: 'Tab', keyCode: 9, shiftKey: true,
        }));
      });
    },
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
    return button.exists();
  });

  it('Renders the popover overlay when the trigger is clicked', () => {
    return popover.exists();
  });

  describe('Pressing the escape key', () => {
    beforeEach(async () => {
      // The expanded announcement won't be read by screen readers if focus is moved to the popover.
      await PopoverInteractor({ focused: false }).pressEscape();
    });

    it('closes the popover', () => {
      return popover.absent();
    });

    it('focuses the trigger', () => {
      return button.is({ focused: true });
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
      return content.exists();
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
    });

    it('Renders the popover overlay by default', () => {
      return popover.exists();
    });

    it('Closes the popover overlay when the trigger is clicked', async () => {
      await button.click();

      return popover.absent();
    });
  });

  describe('Keyboard interaction', () => {
    const contentButton = ButtonInteractor('Content button');
    const nextButton = ButtonInteractor('Next button');

    beforeEach(async () => {
      await mount(
        <>
          <Popover
            renderTrigger={({ toggle, ref }) => (
              <>
                <Button ref={ref} onClick={toggle} id="trigger-button">
                  Toggle
                </Button>
                <Button id="next-button">Next button</Button>
              </>
            )}
          >
            <Button id="content-button">Content button</Button>
          </Popover>
        </>
      );

      await button.click();
    });

    it('keeps focus on the trigger when opened', () => {
      return button.is({ focused: true });
    });

    describe('Pressing Tab from the trigger', () => {
      beforeEach(async () => {
        await button.focus();
        await popover.pressTab();
      });

      it('moves focus to the first focusable element in the popover', () => {
        return contentButton.is({ focused: true });
      });
    });

    describe('Pressing Tab from the last focusable element in the popover', () => {
      beforeEach(async () => {
        await contentButton.focus();
        await popover.pressTab();
      });

      it('moves focus to the next focusable element after the trigger', () => {
        return nextButton.is({ focused: true });
      });
    });

    describe('Pressing Shift+Tab from the first focusable element in the popover', () => {
      beforeEach(async () => {
        await contentButton.focus();
        await popover.pressShiftTab();
      });

      it('moves focus back to the trigger', () => {
        return button.is({ focused: true });
      });
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
