import React, { createRef } from 'react';
import { mount, setup } from '../setup';
import { expect } from 'chai';
import sinon from 'sinon';

import HotKeys from '../../HotKeys';
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
let altHandler = sinon.spy(() => console.log('altHandler'))
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
}


describe('Nested key map definitions:', () => {
  setup();
  before(function () {
    this.outerKeyMap = {
      'ENTER_OUTER': 'enter',
      'TAB': 'tab',
    };

    this.innerKeyMap = {
      'ENTER_INNER': 'enter',
      'ALT': 'alt',
    };

  });

  context('when components are nested with key maps that overlap', () => {

    context('and only the outer component has handlers defined', () => {
      beforeEach(function () {
        const handlers = {
          'ENTER_OUTER': enterOuterHandler,
          'TAB': tabOuterHandler,
          'ENTER_INNER': enterInnerHandler,
          'ALT': altOuterHandler,
        };

        const outerRef = createRef();
        const innerRef = createRef();

        this.wrapper = mount(
          <HotKeys keyMap={this.outerKeyMap} handlers={handlers} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <input data-testid="outerChildElement" />

              <HotKeys keyMap={this.innerKeyMap} id="inner" attach={innerRef}>
                <input data-testid="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );

      });

      context('and a child of the outer component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.input = new FocusableElement(this.wrapper, 'outerChildElement');
          this.input.focus();
        });

        it('calls bound handler of outer component since it contains a matching keyMap entry', function () {
          this.input.keyDown(KeyCode.TAB);

          expect(tabOuterHandler).to.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', function () {
          this.input.keyDown(KeyCode.ALT);

          expect(tabOuterHandler).to.not.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(enterOuterHandler).to.have.been.called;
          expect(tabOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

      });

      context('and a child of the inner component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.input = new FocusableElement(this.wrapper, 'innerChildElement');
          this.input.focus();
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', function () {
          this.input.keyDown(KeyCode.TAB);

          expect(tabOuterHandler).to.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', function () {
          this.input.keyDown(KeyCode.ALT);

          expect(tabOuterHandler).to.not.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(enterOuterHandler).to.have.been.called;
          expect(tabOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altOuterHandler).to.not.have.been.called;
        });

      });


    });

    context('and only the inner component has handlers defined', () => {
      beforeEach(function () {
        const outerRef = createRef();
        const innerRef = createRef();

        const handlers = {
          'ENTER_OUTER': enterOuterHandler,
          'TAB': tabHandler,
          'ENTER_INNER': enterInnerHandler,
          'ALT': altHandler,
        };

        this.wrapper = mount(
          <HotKeys keyMap={this.outerKeyMap} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <input data-testid="outerChildElement" />
              <HotKeys keyMap={this.innerKeyMap} handlers={handlers} id="inner" attach={innerRef}>
                <input data-testid="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );

      });

      context('and a child of the outer component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.input = new FocusableElement(this.wrapper, 'outerChildElement');
          this.input.focus();
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the outer component are pressed', function () {
          this.input.keyDown(KeyCode.TAB);

          expect(tabHandler).to.not.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altHandler).to.not.have.been.called;
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', function () {
          this.input.keyDown(KeyCode.ALT);

          expect(tabHandler).to.not.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altHandler).to.not.have.been.called;
        });

        it('then does not trigger any action when keys that match hotkeys defined in both components are pressed', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(enterOuterHandler).to.not.have.been.called;
          expect(tabHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altHandler).to.not.have.been.called;
        });

      });

      context('and a child of the inner component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.input = new FocusableElement(this.wrapper, 'innerChildElement');
          this.input.focus();
        });

        it('then calls the handler for the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', function () {
          this.input.keyDown(KeyCode.TAB);

          expect(tabHandler).to.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altHandler).to.not.have.been.called;
        });

        it('then calls the handler for the action defined in the inner component when keys that match hotkeys defined only in the inner component are pressed', function () {
          this.input.keyDown(KeyCode.ALT);

          expect(tabHandler).to.not.have.been.called;
          expect(enterOuterHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.not.have.been.called;
          expect(altHandler).to.have.been.called;
        });

        it('then calls the handler for the action defined in the inner component when keys that match hotkeys defined in both components are pressed', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(enterOuterHandler).to.not.have.been.called;
          expect(tabHandler).to.not.have.been.called;
          expect(enterInnerHandler).to.have.been.called;
          expect(altHandler).to.not.have.been.called;
        });

      });
    });

    context('and both components have handlers defined', () => {
      beforeEach(function () {
        const outerHandlers = {
          'ENTER_OUTER': outer_outer_enter,
          'TAB': tabOuterHandler,
          'ENTER_INNER': outer_inner_enter,
          'ALT': altOuterHandler,
        };

        const innerHandlers = {
          'ENTER_OUTER': inner_outer_enter,
          'TAB': tabInnerHandler,
          'ENTER_INNER': inner_inner_enter,
          'ALT': altInnerHandler,
        };

        const outerRef = createRef();
        const innerRef = createRef();

        this.wrapper = mount(
          <HotKeys keyMap={this.outerKeyMap} handlers={outerHandlers} id="outer" attach={outerRef}>
            <div ref={outerRef} >
              <input data-testid="outerChildElement" />

              <HotKeys keyMap={this.innerKeyMap} handlers={innerHandlers} id="inner" attach={innerRef}>
                <input data-testid="innerChildElement" ref={innerRef} />
              </HotKeys>
            </div>
          </HotKeys>
        );
      });

      context('and a child of the outer component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.outerInput = new FocusableElement(this.wrapper, 'outerChildElement');
          this.outerInput.focus();
        });

        it('then calls the handler defined in the outer component for the the action defined in the outer component when keys that match hotkeys defined only in the outer component are pressed', function () {
          this.outerInput.keyDown(KeyCode.TAB);

          expect(outer_outer_enter).to.have.not.been.called;
          expect(tabOuterHandler).to.have.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.not.been.called;
          expect(inner_inner_enter).to.have.not.been.called;
          expect(altInnerHandler).to.have.not.been.called;
        });

        it('then does not trigger any action when keys that match hotkeys defined only in the inner component are pressed', function () {
          this.outerInput.keyDown(KeyCode.ALT);

          expect(outer_outer_enter).to.have.not.been.called;
          expect(tabOuterHandler).to.have.not.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.not.been.called;
          expect(inner_inner_enter).to.have.not.been.called;
          expect(altInnerHandler).to.have.not.been.called;
        });

        it('then calls the handler defined in the outer component for the action defined in the outer component when keys that match hotkeys defined in both components are pressed', function () {
          this.outerInput.keyDown(KeyCode.ENTER);

          expect(outer_outer_enter).to.have.been.called;
          expect(tabOuterHandler).to.have.not.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.not.been.called;
          expect(inner_inner_enter).to.have.not.been.called;
          expect(altInnerHandler).to.have.not.been.called;
        });

      });

      context('and a child of the inner component is in focus', () => {
        beforeEach(function () {
          resetHandlers();
          this.input = new FocusableElement(this.wrapper, 'innerChildElement');
          this.input.focus();
        });

        it('handler: inner only, keyMapped: outer only', function () {
          this.input.keyDown(KeyCode.TAB);

          expect(outer_outer_enter).to.have.not.been.called;
          expect(tabOuterHandler).to.have.not.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.been.called;
          expect(inner_inner_enter).to.have.not.been.called;
          expect(altInnerHandler).to.have.not.been.called;
        });

        it('handler: inner only, keyMapped: inner only', function () {
          this.input.keyDown(KeyCode.ALT);

          expect(outer_outer_enter).to.have.not.been.called;
          expect(tabOuterHandler).to.have.not.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.not.been.called;
          expect(inner_inner_enter).to.have.not.been.called;
          expect(altInnerHandler).to.have.been.called;
        });

        it('handler: inner and outer, keymapped: inner and outer, called: inner only', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(outer_outer_enter).to.have.not.been.called;
          expect(tabOuterHandler).to.have.not.been.called;
          expect(outer_inner_enter).to.have.not.been.called;
          expect(altOuterHandler).to.have.not.been.called;

          expect(inner_outer_enter).to.have.not.been.called;
          expect(tabInnerHandler).to.have.not.been.called;
          expect(inner_inner_enter).to.have.been.called;
          expect(altInnerHandler).to.have.not.been.called;
        });

      });

    });
  });

});
