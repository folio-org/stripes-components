/**
 * Tooltip tests
 */

import React, { createRef } from 'react';

import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { IconButton as IconInteractor, Tooltip as Interactor, Keyboard, runAxeTest } from '@folio/stripes-testing';
import { mount, mountWithContext } from '../../../tests/helpers';
import Tooltip from '../Tooltip';
import IconButton from '../../IconButton';


describe('Tooltip', () => {
  const tooltip = Interactor();
  const tooltipProximity = Interactor('clear this field', { proximity: true });
  const iconButton = IconInteractor('trash');
  const text = 'Test text';
  const translationText = 'clear this field';
  const sub = 'Test sub';
  const id = 'test-tooltip';
  let consoleSpy;

  beforeEach(async () => {
    await mountWithContext(
      <Tooltip
        text={translationText}
        sub={sub}
        id={id}
      >
        {({ ref, ariaIds }) => (
          <IconButton
            icon="trash"
            ref={ref}
            aria-labelledby={ariaIds.text}
            aria-describedby={ariaIds.sub}
          />
        )}
      </Tooltip>
    );
    await iconButton.focus();
  });

  it('contains no axe errors - Tooltip', runAxeTest);

  it('displays the tooltip', () => tooltip.is({ visible: true }));

  it('renders a text inside the tooltip', () => tooltip.has({ text: 'clear this field' }));

  it('renders a sub inside the tooltip', () => tooltip.has({ subtext: 'Test sub' }));

  it('renders a proximity element (for screen reader accessibility)', () => tooltipProximity.exists());

  describe('Pressing the escape key', () => {
    beforeEach(() => Keyboard.escape());

    it('should hide the tooltip', () => tooltip.is({ visible: false }));
  });

  describe('Passing a <div> to text prop', () => {
    beforeEach(async () => {
      consoleSpy = sinon.spy(console, 'error');
      await mount(
        <Tooltip
          text={<div>not allowed</div>}
          sub={sub}
          id={id}
        >
          {({ ref, ariaIds }) => (
            <IconButton
              icon="trash"
              ref={ref}
              aria-labelledby={ariaIds.text}
              aria-describedby={ariaIds.sub}
            />
          )}
        </Tooltip>
      );
      await iconButton.focus();
    });

    afterEach(() => {
      console.error.restore();
    });

    it('triggers a propType error', () => {
      expect(consoleSpy.called).to.be.true;
    });
  });

  describe('Not passing a text prop', () => {
    afterEach(() => {
      console.error.restore();
    });

    beforeEach(async () => {
      consoleSpy = sinon.spy(console, 'error');
      await mount(
        <Tooltip
          sub={sub}
          id={id}
        >
          {({ ref, ariaIds }) => (
            <IconButton
              icon="trash"
              ref={ref}
              aria-labelledby={ariaIds.text}
              aria-describedby={ariaIds.sub}
            />
          )}
        </Tooltip>
      );
      await iconButton.focus();
    });

    it('triggers a propType error', () => {
      expect(consoleSpy.called).to.be.true;
    });
  });

  describe('Passing a custom triggerRef', () => {
    beforeEach(async () => {
      const ref = createRef(null);
      await mount(
        <>
          <IconButton
            icon="trash"
            ref={ref}
          />
          <Tooltip
            id={id}
            triggerRef={ref}
            text={text}
          />
        </>
      );
      await iconButton.focus();
    });

    it('displays the attached external tooltip on focus/hover', () => {
      tooltip.is({ visible: true });
    });
  });
});
