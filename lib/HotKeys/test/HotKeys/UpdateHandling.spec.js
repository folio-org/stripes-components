import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import HotKeysHarness from '../support/Harness';
import { mount, setup } from '../setup';
import KeyCode from '../support/KeyCode';
import FocusableElement from '../support/FocusableElement';

let outer_outer_enter = sinon.spy(() => console.log('outer_outer_enter'));
let outer_inner_enter = sinon.spy(() => console.log('outer_inner_enter'));
let inner_outer_enter = sinon.spy(() => console.log('inner_outer_enter'));
let inner_inner_enter = sinon.spy(() => console.log('inner_inner_enter'));
let enterOuterHandler = sinon.spy(() => console.log('enterOuter'));
let enterInnerHandler = sinon.spy(() => console.log('enterInner'));

let tabOuterHandler = sinon.spy(() => console.log('tabOuter'));
let tabInnerHandler = sinon.spy(() => console.log('tabInner'));
let tabHandler = sinon.spy(() => console.log('tabHandler'));

let altOuterHandler = sinon.spy(() => console.log('altOuter'));
let altInnerHandler = sinon.spy(() => console.log('altInner'));
let altHandler = sinon.spy(() => console.log('altHandler'));

let downOuterHandler = sinon.spy(() => console.log('downOuter'));

const resetHandlers = () => {
  enterOuterHandler.resetHistory();
  enterInnerHandler.resetHistory();

  tabOuterHandler.resetHistory();
  tabInnerHandler.resetHistory();
  tabHandler.resetHistory();

  altOuterHandler.resetHistory();
  altInnerHandler.resetHistory();
  altHandler.resetHistory();

  outer_outer_enter.resetHistory();
  outer_inner_enter.resetHistory();

  inner_outer_enter.resetHistory();
  inner_inner_enter.resetHistory();

  downOuterHandler.resetHistory();
}

describe('Update Handling', () => {
  setup();
  beforeEach(function () {
    this.altOuterKey = {
      'TAB': 'down'
    };

    this.altOuterHandler = {
      'TAB': downOuterHandler
    };

    this.outerKeyMap = {
      'ENTER_OUTER': 'enter',
      'TAB': 'tab',
    };

    this.innerKeyMap = {
      'ENTER_INNER': 'enter',
      'ALT': 'alt',
    };

    this.outerHandlers = {
      'ENTER_OUTER': outer_outer_enter,
      'TAB': tabOuterHandler,
      'ENTER_INNER': outer_inner_enter,
      'ALT': altOuterHandler,
    };

    this.innerHandlers = {
      'ENTER_OUTER': inner_outer_enter,
      'TAB': tabInnerHandler,
      'ENTER_INNER': inner_inner_enter,
      'ALT': altInnerHandler,
    };

    this.wrapper = mount(
      <HotKeysHarness
        innerKeyMap={this.innerKeyMap}
        innerHandlers={this.innerHandlers}
        outerKeyMap={this.outerKeyMap}
        outerHandlers={this.outerHandlers}
        innerTestId="innerTestId"
        outerTestId="outerTestId"
        changeKeyTestId="changeKey"
        changeHandlerTestId="changeHandler"
        alternativeOuterKey={this.altOuterKey}
        alternativeOuterHandler={this.altOuterHandler}
      />
    );

    this.outerInput = new FocusableElement(this.wrapper, 'outerTestId');
    this.innerInput = new FocusableElement(this.wrapper, 'innerTestId');
  });

  describe('basic functionality', () => {
    beforeEach(function () {
      resetHandlers();
    });

    it('handles key press for outer HotKeys', function () {
      this.outerInput.focus();
      this.outerInput.keyDown(KeyCode.TAB);
      expect(tabOuterHandler.calledOnce).to.be.true;
    });

    it('handles key press for inner HotKeys', function () {
      this.innerInput.focus();
      this.innerInput.keyDown(KeyCode.TAB);
      expect(tabInnerHandler.calledOnce).to.be.true;
    });

    describe('after a state update', function () {
      beforeEach(function () {
        this.outerInput.fill('test');
      });

      it('displays changed value', function () {
        expect(this.outerInput.getInstance().value).to.equal('test');
      });

      it('calls handlers only once for outer HotKeys', function () {
        this.outerInput.focus();
        this.outerInput.keyDown(KeyCode.TAB);
        expect(tabOuterHandler.callCount).to.equal(1);
      });

      it('handles key press for inner HotKeys', function () {
        this.innerInput.focus();
        this.innerInput.keyDown(KeyCode.TAB);
        expect(tabInnerHandler.callCount).to.equal(1);
      });
    });
  });

  describe('changing hotKey mapping', function () {
    beforeEach(async function () {
      this.changeButton = this.wrapper.getByTestId('changeKey');
      await fireEvent.click(this.changeButton);
    });

    it('updates outer hotkey mapping', function () {
      this.outerInput.focus();
      this.outerInput.keyDown(KeyCode.DOWN);
      expect(tabOuterHandler.callCount).to.equal(1);
    });
  });

  describe('changing handler mapping', function () {
    beforeEach(async function () {
      this.changeButton = this.wrapper.getByTestId('changeHandler');
      await fireEvent.click(this.changeButton);
    });

    it('updates outer handler mapping', function () {
      this.outerInput.focus();
      this.outerInput.keyDown(KeyCode.TAB);
      expect(downOuterHandler.callCount).to.equal(1);
    });
  });
});
