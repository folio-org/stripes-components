import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

describe('Hard sequence handlers:', () => {
  let hardSequenceHandler;
  let handlers;

  beforeEach(() => {
    hardSequenceHandler = sinon.spy();

    handlers = {
      'enter': hardSequenceHandler,
    };
  });

  describe('when the key sequence has not been associated with an action', () => {
    beforeEach(async () => {
      const el = createRef();
      await mount(
        <div>
          <HotKeys handlers={handlers} id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
    });
  });

  describe('when the key sequence has been associated with an action in the same HotKeys component', () => {
    beforeEach(async () => {
      const el = createRef();
      await mount(
        <div>
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={handlers} id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
    });
  });

  describe('when the key sequence has been associated with an action in a parent HotKeys component', () => {
    beforeEach(async () => {
      const el = createRef();
      await mount(
        <div>
          <HotKeys actions={{ 'ENTER': 'enter' }} id="outer" attach={el}>
            <HotKeys handlers={handlers} id="inner" attach={el}>
              <input aria-label="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
    });
  });

  describe('when the key sequence has been associated with an action and has a handler in the same HotKeys component', () => {
    let otherHandler;

    beforeEach(async () => {
      otherHandler = sinon.spy();
      const el = createRef();

      await mount(
        <div>
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={{ 'ENTER': otherHandler, ...handlers }} id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
      await converge(() => otherHandler.notCalled);
    });
  });

  describe('when the key sequence has been associated with an action and has a handler in a parent HotKeys component', () => {
    let otherHandler;

    beforeEach(async () => {
      otherHandler = sinon.spy();
      const el = createRef();

      await mount(
        <div>
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={{ 'ENTER': otherHandler }} id="outer" attach={el}>
            <HotKeys handlers={handlers} id="inner" attach={el}>
              <input aria-label="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
      await converge(() => otherHandler.notCalled);
    });
  });

  describe('when the hard key sequence handler has been defined in a parent HotKeys component', () => {
    let outerHardSequenceHandler;

    beforeEach(async () => {
      outerHardSequenceHandler = sinon.spy();
      const el = createRef();

      await mount(
        <div>
          <HotKeys handlers={{ 'enter': outerHardSequenceHandler }} id="outer" attach={el}>
            <HotKeys handlers={handlers} id="inner" attach={el}>
              <input aria-label="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );

      await Input('childElement').focus();
    });

    it('then calls the hard sequence handler in the child component', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => hardSequenceHandler.called);
      await converge(() => outerHardSequenceHandler.notCalled);
    });
  });
});
