import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

describe('Specifying key map using objects:', () => {
  describe('when a keydown keymap is specified as an object', () => {
    let handler;

    beforeEach(async () => {
      handler = sinon.spy((e) => console.log(`handler used: ${e.type}`));

      const keyMap = {
        'ENTER': {
          sequence: 'enter',
          eventType: 'keydown',
        },
      };

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();

      await mount(
        <HotKeys keyMap={keyMap} handlers={handlers} focused attach={el}>
          <input aria-label="childElement" ref={el} />
        </HotKeys>
      );

      await Input('childElement').focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => handler.called);
    });
  });

  describe('when a keyup keymap is specified as an object', () => {
    let handler;

    beforeEach(async () => {
      handler = sinon.spy((e) => console.log(`handler used: ${e.type}`));

      const keyMap = {
        'ENTER': {
          sequence: 'enter',
          eventType: 'keyup',
        },
      };

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();

      await mount(
        <HotKeys keyMap={keyMap} handlers={handlers} focused attach={el}>
          <input aria-label="childElement" ref={el} />
        </HotKeys>
      );

      await Input('childElement').focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', async () => {
      await Keyboard.pressKey('Enter', { keyCode: 13 });

      await converge(() => handler.called);
    });
  });

  describe('when a keypress keymap is specified as an object', () => {
    let handler;

    beforeEach(async () => {
      handler = sinon.spy((e) => console.log(`handler used: ${e.type}`));

      const keyMap = {
        'A': {
          sequence: 'a',
          eventType: 'keypress',
        },
      };

      const handlers = {
        'A': handler,
      };

      const el = createRef();

      await mount(
        <HotKeys keyMap={keyMap} handlers={handlers} focused attach={el}>
          <input aria-label="childElement" ref={el} />
        </HotKeys>
      );

      await Input('childElement').focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', async () => {
      await Keyboard.pressKey('a', { keyCode: 65 });

      await converge(() => handler.called);
    });
  });
});
