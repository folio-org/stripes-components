import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

describe('Focused prop: bool', () => {
  const keyMap = {
    'ENTER': 'enter',
    'TAB': 'tab',
  };

  describe('when a keyMap and a handler are provided to the same component and a child element is NOT focused', () => {
    let handler;
    let handlers;

    beforeEach(() => {
      handler = sinon.spy();
      handlers = { 'ENTER': handler };
    });

    describe('and no value has been passed to focused', () => {
      beforeEach(async () => {
        const el = createRef();
        await mount(
          <HotKeys keyMap={keyMap} handlers={handlers} attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>
        );

        await Input('childElement').focus();
      });

      it('then DOES NOT call the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and focused has been set to true', () => {
      beforeEach(async () => {
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
  });

  describe('when a keyMap is provided to a parent component and a handler to a child component', () => {
    let handler;
    let handlers;

    beforeEach(() => {
      handler = sinon.spy();
      handlers = { 'ENTER': handler };
    });

    describe('and no value has been passed to focused', () => {
      beforeEach(async () => {
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} attach={outerRef}>
            <div ref={outerRef}>
              <HotKeys handlers={handlers} attach={innerRef}>
                <input aria-label="handlerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('handlerChildElement').focus();
      });

      it('then DOES NOT call the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and focused has been set to true on the component that defines the keyMap', () => {
      beforeEach(async () => {
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} focused attach={outerRef}>
            <div ref={outerRef}>
              <HotKeys handlers={handlers} attach={innerRef}>
                <input aria-label="handlerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('handlerChildElement').focus();
      });

      it('then DOES NOT call the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.notCalled);
      });
    });

    describe('and focused has been set to true on the component that defines the handlers', () => {
      beforeEach(async () => {
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} attach={outerRef}>
            <div ref={outerRef}>
              <HotKeys handlers={handlers} focused attach={innerRef}>
                <input aria-label="handlerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('handlerChildElement').focus();
      });

      it('then calls the handler when a key is pressed that matches the keyMap', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => handler.called);
      });
    });
  });

  describe('when HotKey components defining handlers are nested inside each other', () => {
    let outerEnterHandler;
    let outerTabHandler;
    let innerEnterHandler;
    let outerHandlers;
    let innerHandlers;

    beforeEach(() => {
      outerEnterHandler = sinon.spy();
      outerTabHandler = sinon.spy();
      innerEnterHandler = sinon.spy();

      outerHandlers = {
        'ENTER': outerEnterHandler,
        'TAB': outerTabHandler,
      };

      innerHandlers = {
        'ENTER': innerEnterHandler,
      };
    });

    describe('and the inner component has a focused prop of true', () => {
      beforeEach(async () => {
        const wrapperRef = createRef();
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} attach={wrapperRef}>
            <div ref={wrapperRef}>
              <HotKeys handlers={outerHandlers} attach={outerRef}>
                <div ref={outerRef}>
                  <input aria-label="outerElement" />

                  <HotKeys handlers={innerHandlers} focused attach={innerRef}>
                    <input aria-label="innerElement" ref={innerRef} />
                  </HotKeys>
                </div>
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('innerElement').focus();
      });

      it('then only calls the handler defined in the inner component when a key is pressed for which handlers are defined in both components', async () => {
        await Keyboard.pressKey('Enter', { keyCode: 13 });

        await converge(() => innerEnterHandler.called);
        await converge(() => outerEnterHandler.notCalled);
      });

      it('then does NOT call the handler defined in the outer component when a key is pressed that only the outer component has a handler for', async () => {
        await Keyboard.pressKey('Tab', { keyCode: 9 });

        await converge(() => outerTabHandler.notCalled);
      });

      it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', async () => {
        await Keyboard.pressKey('alt', { keyCode: 18 });

        await converge(() => innerEnterHandler.notCalled);
        await converge(() => outerTabHandler.notCalled);
        await converge(() => outerEnterHandler.notCalled);
      });
    });

    describe('and the outer component has a focused prop of true', () => {
      beforeEach(async () => {
        const wrapperRef = createRef();
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} attach={wrapperRef}>
            <div ref={wrapperRef}>
              <HotKeys handlers={outerHandlers} focused attach={outerRef}>
                <div ref={outerRef}>
                  <input aria-label="outerElement" />

                  <HotKeys handlers={innerHandlers} attach={innerRef}>
                    <input aria-label="innerElement" ref={innerRef} />
                  </HotKeys>
                </div>
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('innerElement').focus();
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

    describe('and both components have a focused prop of true', () => {
      beforeEach(async () => {
        const wrapperRef = createRef();
        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} attach={wrapperRef}>
            <div ref={wrapperRef}>
              <HotKeys handlers={outerHandlers} focused attach={outerRef}>
                <div ref={outerRef}>
                  <input aria-label="outerElement" />

                  <HotKeys handlers={innerHandlers} focused attach={innerRef}>
                    <input aria-label="innerElement" ref={innerRef} />
                  </HotKeys>
                </div>
              </HotKeys>
            </div>
          </HotKeys>
        );

        await Input('innerElement').focus();
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
  });

  describe('when HotKeys components are siblings', () => {
    describe('and both components have a focused prop of true', () => {
      let firstEnterHandler;
      let firstTabHandler;
      let secondEnterHandler;

      beforeEach(async () => {
        firstEnterHandler = sinon.spy();
        firstTabHandler = sinon.spy();
        secondEnterHandler = sinon.spy();

        const firstHandlers = {
          'ENTER': firstEnterHandler,
          'TAB': firstTabHandler,
        };

        const secondHandlers = {
          'ENTER': secondEnterHandler,
        };

        const wrapperRef = createRef();
        const aRef = createRef();
        const bRef = createRef();

        await mount(
          <HotKeys keyMap={keyMap} id="outer HK" attach={wrapperRef}>
            <div ref={wrapperRef}>
              <HotKeys handlers={firstHandlers} focused id="first HK" attach={aRef}>
                <input aria-label="firstElement" ref={aRef} />
              </HotKeys>

              <HotKeys handlers={secondHandlers} focused id="second HK" attach={bRef}>
                <input aria-label="secondElement" ref={bRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );
      });

      describe('and the focus is on a child of the first component', () => {
        beforeEach(async () => {
          await Input('firstElement').focus();
        });

        it('then only calls the handlers on the first component when a key is pressed for which handlers are defined in both components', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => firstEnterHandler.called);
          await converge(() => secondEnterHandler.notCalled);
        });

        it('then calls the handler defined in the first component when a key is pressed that only the first component has a handler for', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => firstTabHandler.called);
        });

        it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => secondEnterHandler.notCalled);
          await converge(() => firstTabHandler.notCalled);
          await converge(() => firstEnterHandler.notCalled);
        });
      });
    });
  });
});
