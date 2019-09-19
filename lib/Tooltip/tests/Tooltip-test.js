/**
 * Tooltip tests
 */

import React, { createRef, Fragment } from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import TooltipInteractor from './interactor';
import Tooltip from '../Tooltip';
import IconButton from '../../IconButton';
import IconButtonInteractor from '../../IconButton/tests/interactor';

describe('Tooltip', () => {
  const tooltip = new TooltipInteractor();
  const iconButton = new IconButtonInteractor();
  const text = 'Test text';
  const sub = 'Test sub';
  const id = 'test-tooltip';

  beforeEach(async () => {
    await mount(
      <Tooltip
        text={text}
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
      await iconButton.focus();
    });

    it('displays the attached tooltip', () => {
      expect(tooltip.isTooltipVisible).to.be.true;
    });
  });

  describe('Passing a custom triggerRef', () => {
    beforeEach(async () => {
      const ref = createRef(null);
      await mount(
        <Fragment>
          <IconButton
            icon="trash"
            ref={ref}
          />
          <Tooltip
            id={id}
            triggerRef={ref}
            text={text}
          />
        </Fragment>
      );
      await iconButton.focus();
    });

    it('displays the attached external tooltip on focus/hover', () => {
      expect(tooltip.isTooltipVisible).to.be.true;
    });
  });
});
