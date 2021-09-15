/**
 * Popover tests
 */

import React, { useState } from 'react';
import { Interactor } from '@bigtest/interactor';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import ButtonInteractor from '../../Button/tests/interactor';

import Popover from '../Popover';
import PopoverInteractor from './interactor';

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

describe.only('Popover', () => {
  const popover = new PopoverInteractor();
  const button = new ButtonInteractor('#trigger-button');
  const content = new Interactor('#content');

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

  it('Renders a trigger button', () => {
    expect(button.isPresent).to.be.true;
  });

  it('Renders the popover overlay when the trigger is clicked', () => {
    expect(popover.isOpen).to.be.true;
  });

  describe('Pressing the escape key', () => {
    beforeEach(async () => {
      await popover.pressEscape();
    });

    it('closes the popover', () => {
      expect(popover.isOpen).to.be.false;
    });

    it('focuses the trigger', () => {
      expect(button.isFocused).to.be.true;
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
      expect(content.isPresent).to.be.true;
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
      expect(popover.isOpen).to.be.true;
    });

    it('Closes the popover overlay when the trigger is clicked', () => {
      expect(popover.isOpen).to.be.false;
    });
  });

  describe('If the legacy component API is used', () => {
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

      await button.click();
    });

    it('Renders the legacy popover and opens the overlay when the toggle is clicked', () => {
      expect(popover.isOpen).to.be.true;
    });

    describe('When the toggle is clicked again', () => {
      beforeEach(async () => {
        button.click();
      });

      it('Hides the popover overlay', () => {
        expect(popover.isOpen).to.be.true;
      });
    });
  });
});
