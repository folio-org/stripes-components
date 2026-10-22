import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeysHarness from './HotKeys-test-harness';

const Input = Bigtest.TextField;
const Button = Bigtest.Button;

describe('Update Handling', () => {
  let outerOuterEnter;
  let outerInnerEnter;
  let innerOuterEnter;
  let innerInnerEnter;
  let tabOuterHandler;
  let tabInnerHandler;
  let downOuterHandler;

  beforeEach(async () => {
    outerOuterEnter = sinon.spy(() => console.log('outer_outer_enter'));
    outerInnerEnter = sinon.spy(() => console.log('outer_inner_enter'));
    innerOuterEnter = sinon.spy(() => console.log('inner_outer_enter'));
    innerInnerEnter = sinon.spy(() => console.log('inner_inner_enter'));
    tabOuterHandler = sinon.spy(() => console.log('tabOuter'));
    tabInnerHandler = sinon.spy(() => console.log('tabInner'));
    downOuterHandler = sinon.spy(() => console.log('downOuter'));

    const altOuterKey = {
      'TAB': 'down'
    };

    const altOuterHandler = {
      'TAB': downOuterHandler
    };

    const outerKeyMap = {
      'ENTER_OUTER': 'enter',
      'TAB': 'tab',
    };

    const innerKeyMap = {
      'ENTER_INNER': 'enter',
      'ALT': 'alt',
    };

    const outerHandlers = {
      'ENTER_OUTER': outerOuterEnter,
      'TAB': tabOuterHandler,
      'ENTER_INNER': outerInnerEnter,
      'ALT': sinon.spy(),
    };

    const innerHandlers = {
      'ENTER_OUTER': innerOuterEnter,
      'TAB': tabInnerHandler,
      'ENTER_INNER': innerInnerEnter,
      'ALT': sinon.spy(),
    };

    await mount(
      <HotKeysHarness
        innerKeyMap={innerKeyMap}
        innerHandlers={innerHandlers}
        outerKeyMap={outerKeyMap}
        outerHandlers={outerHandlers}
        innerTestId="innerTestId"
        outerTestId="outerTestId"
        alternativeOuterKey={altOuterKey}
        alternativeOuterHandler={altOuterHandler}
      />
    );
  });

  describe('basic functionality', () => {
    it('handles key press for outer HotKeys', async () => {
      await Input('outerTestId').focus();
      await Keyboard.pressKey('Tab', { keyCode: 9 });

      await converge(() => tabOuterHandler.calledOnce);
    });

    it('handles key press for inner HotKeys', async () => {
      await Input('innerTestId').focus();
      await Keyboard.pressKey('Tab', { keyCode: 9 });

      await converge(() => tabInnerHandler.calledOnce);
    });

    describe('after a state update', () => {
      beforeEach(async () => {
        await Input('outerTestId').fillIn('test');
      });

      it('displays changed value', () => {
        return Input('outerTestId').has({ value: 'test' });
      });

      it('calls handlers only once for outer HotKeys', async () => {
        await Input('outerTestId').focus();
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => tabOuterHandler.callCount === 1);
      });

      it('handles key press for inner HotKeys', async () => {
        await Input('innerTestId').focus();
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => tabInnerHandler.callCount === 1);
      });
    });
  });

  describe('changing hotKey mapping', () => {
    beforeEach(async () => {
      await Button('Change Key').click();
    });

    it('updates outer hotkey mapping', async () => {
      await Input('outerTestId').focus();
      await Keyboard.pressKey('Down', { keyCode: 40 });

      await converge(() => tabOuterHandler.callCount === 1);
    });
  });

  describe('changing handler mapping', () => {
    beforeEach(async () => {
      await Button('Change Handler').click();
    });

    it('updates outer handler mapping', async () => {
      await Input('outerTestId').focus();
      await Keyboard.pressKey('Tab', { keyCode: 9 });

      await converge(() => downOuterHandler.callCount === 1);
    });
  });
});
