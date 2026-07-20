import React, { createRef } from 'react';
import { mount, setup } from '../setup';
import { expect } from 'chai';
import sinon from 'sinon';

import HotKeys from '../../HotKeys';
import KeyCode from '../support/KeyCode';
import FocusableElement from '../support/FocusableElement';

let handler = sinon.spy((e) => console.log(`handler used: ${e.type}`));

describe('Specifying key map using objects:', () => {
  setup();

  context('when a keydown keymap is specified as an object', () => {

    beforeEach(function () {
      handler.resetHistory();
      this.keyMap = {
        'ENTER': {
          sequence: 'enter',
          eventType: 'keydown',
        },
      };

      this.handlers = {
        'ENTER': handler,
      };

      const el = createRef();

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={this.handlers} focused attach={el}>
          <input data-testid="childElement" ref={el} />
        </HotKeys>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(handler).to.have.been.called;
    });
  });

  context('when a keyup keymap is specified as an object', () => {
    beforeEach(function () {
      handler.resetHistory();
      this.keyMap = {
        'ENTER': {
          sequence: 'enter',
          eventType: 'keyup',
        },
      };

      this.handlers = {
        'ENTER': handler,
      };

      const el = createRef();

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={this.handlers} focused attach={el}>
          <input data-testid="childElement" ref={el} />
        </HotKeys>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', function () {
      this.input.keyUp(KeyCode.ENTER);

      expect(handler).to.have.been.called;
    });
  });

  context('when a keypress keymap is specified as an object', () => {
    beforeEach(function () {
      handler.resetHistory();
      this.keyMap = {
        'A': {
          sequence: 'a',
          eventType: 'keypress',
        },
      };

      this.handlers = {
        'A': handler,
      };

      const el = createRef();

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={this.handlers} focused attach={el}>
          <input data-testid="childElement" ref={el} />
        </HotKeys>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the correct handler when a key is pressed that matches the keyMap', function () {
      this.input.keyPress(KeyCode.A);

      expect(handler).to.have.been.called;
    });
  });
});
