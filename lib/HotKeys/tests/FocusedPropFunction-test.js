import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

describe('Focused Prop: function', () => {
  const keyMap = {
    'ENTER': 'enter',
    'TAB': 'tab',
  };

  describe('when a keyMap and a handler are provided to the same component', () => {
    let handler;
    let el;
    let wrapperRef;

    beforeEach(async () => {
      handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const isFocused = () => document.activeElement === el.current;

      el = createRef();
      wrapperRef = createRef();

      await mount(
        <div ref={wrapperRef}>
          <HotKeys
            noWrapper
            keyMap={keyMap}
            handlers={handlers}
            focused={isFocused}
            id="outer"
            attach={el}
          >
            <input aria-label="childElement" ref={el} />
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );
    });

    it.skip('then renders children without any wrapping divs', () => {
      const html = wrapperRef.current.outerHTML;
      expect(html).to.equal('<div><input aria-label="childElement" tabindex="-1"><input aria-label="siblingElement"></div>');
    });

    describe('and a child element is focused', () => {
      beforeEach(async () => {
        await Input('childElement').focus();
      });

      it('then calls the correct handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.called);
      });

      it('then does NOT call the handler when a key is pressed that does NOT matches the keyMap', async () => {
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and a sibling element is focused', () => {
      beforeEach(async () => {
        await Input('siblingElement').focus();
      });

      it('then does NOT calls the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });
  });

  describe('when a keyMap is provided to a parent component and a handler to a child component', () => {
    let handler;
    let innerRef;
    let wrapperRef;

    beforeEach(async () => {
      innerRef = createRef();
      wrapperRef = createRef();

      const handlerIsFocused = () => document.activeElement === innerRef.current;

      handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const outerRef = createRef();

      await mount(
        <div ref={wrapperRef}>
          <HotKeys keyMap={keyMap} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <HotKeys noWrapper handlers={handlers} focused={handlerIsFocused} id="inner" attach={innerRef}>
                <input aria-label="handlerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
            <input aria-label="keyMapChildElement" />
          </HotKeys>

          <input aria-label="siblingElement" />
        </div>
      );
    });

    describe('and a child element of the component defining the handlers is focused', () => {
      beforeEach(async () => {
        await Input('handlerChildElement').focus();
      });

      it.skip('renders the handlerChild input without a wrapper', () => {
        const html = wrapperRef.current.outerHTML;
        expect(html).to.equal('<div><div tabindex="-1"><div><input aria-label="handlerChildElement" tabindex="-1"></div><input aria-label="keyMapChildElement"></div><input aria-label="siblingElement"></div>');
      });

      it('then calls the correct handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.called);
      });

      it('then does NOT call the handler when a key is pressed that does NOT matches the keyMap', async () => {
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and a child element of the component defining the keyMap is focused', () => {
      beforeEach(async () => {
        await Input('keyMapChildElement').focus();
      });

      it('then does NOT call the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and a sibling element is focused', () => {
      beforeEach(async () => {
        await Input('siblingElement').focus();
      });

      it('then does NOT calls the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });
  });

  describe('when HotKey components defining handlers are nested inside each other', () => {
    let outerEnterHandler;
    let outerTabHandler;
    let innerEnterHandler;
    let innerRef;
    let outerRef;
    let wrapperRef;

    beforeEach(async () => {
      outerEnterHandler = sinon.spy();
      outerTabHandler = sinon.spy();
      innerEnterHandler = sinon.spy();

      innerRef = createRef();
      outerRef = createRef();
      wrapperRef = createRef();

      const focusedInner = () => document.activeElement === innerRef.current;
      const focusedOuter = () => outerRef.current.contains(document.activeElement);

      const outerHandlers = {
        'ENTER': outerEnterHandler,
        'TAB': outerTabHandler,
      };

      const innerHandlers = {
        'ENTER': innerEnterHandler,
      };

      await mount(
        <HotKeys keyMap={keyMap} id="level-a" attach={wrapperRef}>
          <div ref={wrapperRef}>
            <HotKeys noWrapper handlers={outerHandlers} focused={focusedOuter} id="level-b" attach={outerRef}>
              <div ref={outerRef}>
                <input aria-label="outerElement" />

                <HotKeys noWrapper handlers={innerHandlers} focused={focusedInner} id="level-c" attach={innerRef}>
                  <input aria-label="innerElement" ref={innerRef} />
                </HotKeys>
              </div>
            </HotKeys>
          </div>
        </HotKeys>
      );
    });

    describe('and a child element of the inner component is in focus', () => {
      beforeEach(async () => {
        await Input('innerElement').focus();
      });

      it.skip('renders the innerElement and outerElement without a wrapper', () => {
        const html = wrapperRef.current.outerHTML;
        expect(html).to.equal('<div tabindex="-1"><div><div tabindex="-1"><input aria-label="outerElement"><input aria-label="innerElement" tabindex="-1"></div></div></div>');
      });

      it('then only calls the handler defined in the inner component when a key is pressed for which handlers are defined in both components', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => innerEnterHandler.called);
        await converge(() => outerEnterHandler.notCalled);
      });

      it('then calls the handler defined in the outer component when a key is pressed that only the outer component has a handler for', async () => {
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => outerTabHandler.called);
      });

      it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', async () => {
        await Keyboard.pressKey('alt', { keyCode: 18 });

        await converge(() => innerEnterHandler.notCalled);
        await converge(() => outerTabHandler.notCalled);
        await converge(() => outerEnterHandler.notCalled);
      });
    });

    describe('and a child element of the outer component is in focus', () => {
      beforeEach(async () => {
        await Input('outerElement').focus();
      });

      it('then only calls the handler defined in the outer component when a key is pressed for which handlers are defined in both components', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => innerEnterHandler.notCalled);
        await converge(() => outerEnterHandler.called);
      });

      it('then calls the handler defined in the outer component when a key is pressed that only the outer component has a handler for', async () => {
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => outerTabHandler.called);
      });

      it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', async () => {
        await Keyboard.pressKey('alt', { keyCode: 18 });

        await converge(() => innerEnterHandler.notCalled);
        await converge(() => outerTabHandler.notCalled);
        await converge(() => outerEnterHandler.notCalled);
      });
    });
  });
});
