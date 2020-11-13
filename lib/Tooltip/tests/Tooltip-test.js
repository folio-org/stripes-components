/**
 * Tooltip tests
 */

import React, { createRef } from 'react';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import { mount, mountWithContext } from '../../../tests/helpers';
import TooltipInteractor from './interactor';
import Tooltip from '../Tooltip';
import IconButton from '../../IconButton';
import IconButtonInteractor from '../../IconButton/tests/interactor';

import { IconButton as IconInteractor, Tooltip as Interactor } from '@folio/stripes-testing';

describe('Tooltip', () => {
  const tooltip = new TooltipInteractor();
  const iconButton = new IconButtonInteractor();
  const text = 'Test text';
  const translationText = <FormattedMessage id="stripes-components.clearThisField" />;
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

  it('renders a tooltip', () => {
    expect(tooltip.isTooltipVisible).to.be.true;
  });

  it('renders a text inside the tooltip', () => {
    expect(tooltip.hasText).to.be.true;
  });

  it('renders a sub inside the tooltip', () => {
    expect(tooltip.hasText).to.be.true;
  });

  it('renders a proximity element (for screen reader accessibility)', () => {
    expect(tooltip.hasProximityElement).to.be.true;
  });

  describe('Focusing the trigger element', () => {
    beforeEach(async () => {
      await iconButton
        .focus()
        .when(() => tooltip.isTooltipVisible);
    });

    it('displays the attached tooltip', () => {
      expect(tooltip.isTooltipVisible).to.be.true;
    });
  });

  describe('Pressing the escape key', () => {
    beforeEach(async () => {
      await iconButton
        .focus()
        .when(() => tooltip.isTooltipVisible)
        .pressEscape()
        .when(() => !tooltip.isTooltipVisible);
    });

    it('should hide the tooltip', () => {
      expect(tooltip.isTooltipVisible).to.be.false;
    });
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
      expect(tooltip.isTooltipVisible).to.be.true;
    });
  });
});
