import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { Bigtest, Keyboard, converge } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';

const Input = Bigtest.TextField;

describe('Nested key map definitions:', () => {
  const outerKeyMap = {
    'ENTER_OUTER': 'enter',
    'TAB': 'tab',
  };

  const innerKeyMap = {
    'ENTER_INNER': 'enter',
    'ALT': 'alt',
  };

  describe('when components are nested with key maps that overlap', () => {
    describe('and only the outer component has handlers defined', () => {
      let enterOuterHandler;
      let enterInnerHandler;
      let tabOuterHandler;
      let altOuterHandler;

      beforeEach(async () => {
        enterOuterHandler = sinon.spy();
        enterInnerHandler = sinon.spy();
        tabOuterHandler = sinon.spy();
        altOuterHandler = sinon.spy();

        const handlers = {
          'ENTER_OUTER': enterOuterHandler,
          'TAB': tabOuterHandler,
          'ENTER_INNER': enterInnerHandler,
          'ALT': altOuterHandler,
        };

        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={outerKeyMap} handlers={handlers} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <input aria-label="outerChildElement" />

              <HotKeys keyMap={innerKeyMap} id="inner" attach={innerRef}>
                <input aria-label="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );
      });

      describe('and a child of the outer component is in focus', () => {
        beforeEach(async () => {
          await Input('outerChildElement').focus();
        });

        it('calls bound handler of outer component since it contains a matching keyMap entry', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => tabOuterHandler.called);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => tabOuterHandler.notCalled);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => enterOuterHandler.called);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });
      });

      describe('and a child of the inner component is in focus', () => {
        beforeEach(async () => {
          await Input('innerChildElement').focus();
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => tabOuterHandler.called);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => tabOuterHandler.notCalled);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => enterOuterHandler.called);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altOuterHandler.notCalled);
        });
      });
    });

    describe('and only the inner component has handlers defined', () => {
      let enterOuterHandler;
      let enterInnerHandler;
      let tabHandler;
      let altHandler;

      beforeEach(async () => {
        enterOuterHandler = sinon.spy();
        enterInnerHandler = sinon.spy();
        tabHandler = sinon.spy();
        altHandler = sinon.spy();

        const outerRef = createRef();
        const innerRef = createRef();

        const handlers = {
          'ENTER_OUTER': enterOuterHandler,
          'TAB': tabHandler,
          'ENTER_INNER': enterInnerHandler,
          'ALT': altHandler,
        };

        await mount(
          <HotKeys keyMap={outerKeyMap} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <input aria-label="outerChildElement" />
              <HotKeys keyMap={innerKeyMap} handlers={handlers} id="inner" attach={innerRef}>
                <input aria-label="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );
      });

      describe('and a child of the outer component is in focus', () => {
        beforeEach(async () => {
          await Input('outerChildElement').focus();
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the outer component are pressed', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => tabHandler.notCalled);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altHandler.notCalled);
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => tabHandler.notCalled);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altHandler.notCalled);
        });

        it('then does not trigger any action when keys that match hotkeys defined in both components are pressed', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => enterOuterHandler.notCalled);
          await converge(() => tabHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altHandler.notCalled);
        });
      });

      describe('and a child of the inner component is in focus', () => {
        beforeEach(async () => {
          await Input('innerChildElement').focus();
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => tabHandler.called);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altHandler.notCalled);
        });

        it('then calls the handler for the action defined in the inner component when keys that match hotkeys defined only in the inner component are pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => tabHandler.notCalled);
          await converge(() => enterOuterHandler.notCalled);
          await converge(() => enterInnerHandler.notCalled);
          await converge(() => altHandler.called);
        });

        it('then calls the handler for the action defined in the inner component when keys that match hotkeys defined in both components are pressed', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => enterOuterHandler.notCalled);
          await converge(() => tabHandler.notCalled);
          await converge(() => enterInnerHandler.called);
          await converge(() => altHandler.notCalled);
        });
      });
    });

    describe('and both components have handlers defined', () => {
      let outerOuterEnter;
      let outerInnerEnter;
      let innerOuterEnter;
      let innerInnerEnter;
      let tabOuterHandler;
      let tabInnerHandler;
      let altOuterHandler;
      let altInnerHandler;

      beforeEach(async () => {
        outerOuterEnter = sinon.spy();
        outerInnerEnter = sinon.spy();
        innerOuterEnter = sinon.spy();
        innerInnerEnter = sinon.spy();
        tabOuterHandler = sinon.spy();
        tabInnerHandler = sinon.spy();
        altOuterHandler = sinon.spy();
        altInnerHandler = sinon.spy();

        const outerHandlers = {
          'ENTER_OUTER': outerOuterEnter,
          'TAB': tabOuterHandler,
          'ENTER_INNER': outerInnerEnter,
          'ALT': altOuterHandler,
        };

        const innerHandlers = {
          'ENTER_OUTER': innerOuterEnter,
          'TAB': tabInnerHandler,
          'ENTER_INNER': innerInnerEnter,
          'ALT': altInnerHandler,
        };

        const outerRef = createRef();
        const innerRef = createRef();

        await mount(
          <HotKeys keyMap={outerKeyMap} handlers={outerHandlers} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <input aria-label="outerChildElement" />

              <HotKeys keyMap={innerKeyMap} handlers={innerHandlers} id="inner" attach={innerRef}>
                <input aria-label="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );
      });

      describe('and a child of the outer component is in focus', () => {
        beforeEach(async () => {
          await Input('outerChildElement').focus();
        });

        it('then calls the handler defined in the outer component for the the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => outerOuterEnter.notCalled);
          await converge(() => tabOuterHandler.called);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.notCalled);
          await converge(() => innerInnerEnter.notCalled);
          await converge(() => altInnerHandler.notCalled);
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => outerOuterEnter.notCalled);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.notCalled);
          await converge(() => innerInnerEnter.notCalled);
          await converge(() => altInnerHandler.notCalled);
        });

        it('then calls the handler defined in the outer component for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => outerOuterEnter.called);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.notCalled);
          await converge(() => innerInnerEnter.notCalled);
          await converge(() => altInnerHandler.notCalled);
        });
      });

      describe('and a child of the inner component is in focus', () => {
        beforeEach(async () => {
          await Input('innerChildElement').focus();
        });

        it('handler: inner only, keyMapped: outer only', async () => {
          await Keyboard.pressKey('Tab', { keyCode: 9 });

          await converge(() => outerOuterEnter.notCalled);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.called);
          await converge(() => innerInnerEnter.notCalled);
          await converge(() => altInnerHandler.notCalled);
        });

        it('handler: inner only, keyMapped: inner only', async () => {
          await Keyboard.pressKey('alt', { keyCode: 18 });

          await converge(() => outerOuterEnter.notCalled);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.notCalled);
          await converge(() => innerInnerEnter.notCalled);
          await converge(() => altInnerHandler.called);
        });

        it('handler: inner and outer, keymapped: inner and outer, called: inner only', async () => {
          await Keyboard.pressKey('Enter', { keyCode: 13 });

          await converge(() => outerOuterEnter.notCalled);
          await converge(() => tabOuterHandler.notCalled);
          await converge(() => outerInnerEnter.notCalled);
          await converge(() => altOuterHandler.notCalled);

          await converge(() => innerOuterEnter.notCalled);
          await converge(() => tabInnerHandler.notCalled);
          await converge(() => innerInnerEnter.called);
          await converge(() => altInnerHandler.notCalled);
        });
      });
    });
  });
});
