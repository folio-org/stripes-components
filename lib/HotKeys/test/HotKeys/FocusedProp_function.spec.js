import React, { createRef } from 'react';
import { mount, setup } from '../setup';
import { expect } from 'chai';
import sinon from 'sinon';

import HotKeys from '../../HotKeys';
import KeyCode from '../support/KeyCode';
import FocusableElement from '../support/FocusableElement';

describe('Focused Prop: function', function () {
  before(function () {
    setup();

    this.keyMap = {
      'ENTER': 'enter',
      'TAB': 'tab',
    };
  });

  context('when a keyMap and a handler are provided to the same component', function () {
    beforeEach(function () {
      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };

      this.isFocused = () => {
        return document.activeElement === this.input.getInstance();
      }

      const el = createRef();

      this.wrapper = mount(
        <div data-testid="container">
          <HotKeys
            noWrapper
            keyMap={this.keyMap}
            handlers={handlers}
            focused={this.isFocused}
            id="outer"
            attach={el}
          >
            <input data-testid="childElement" ref={el} />
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
    });

    it.skip('then renders children without any wrapping divs', function () {
      let html = this.wrapper.getByTestId('container').outerHTML;
      expect(html).to.equal('<div data-testid="container"><input data-testid="childElement" tabindex="-1"><input data-testid="siblingElement"></div>');
    });

    context('and a child element is focused', function () {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'childElement');
        this.input.getInstance().focus();
      });

      it('then calls the correct handler when a key is pressed that matches the keyMap', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.handler).to.have.been.called;
      });

      it('then does NOT call the handler when a key is pressed that does NOT matches the keyMap', function () {
        this.input.keyDown(KeyCode.TAB);

        expect(this.handler).to.not.have.been.called;
      });
    });

    context('and a sibling element is focused', function () {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'siblingElement');
        this.input.focus();
      });

      it('then does NOT calls the handler when a key is pressed that matches the keyMap', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.handler).to.not.have.been.called;
      });
    });
  });

  context('when a keyMap is provided to a parent component and a handler to a child component', function () {

    beforeEach(function () {

      this.handlerIsFocused = () => {
        return document.activeElement === this.input.getInstance();
      }

      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };

      const outerRef = createRef();
      const innerRef = createRef();

      this.wrapper = mount(
        <div data-testid="container">
          <HotKeys keyMap={this.keyMap} id="outer" attach={outerRef}>
            <div ref={outerRef}>
              <HotKeys noWrapper handlers={handlers} focused={this.handlerIsFocused} id="inner" attach={innerRef}>
                <input data-testid={'handlerChildElement'} ref={innerRef} />
              </HotKeys>
            </div>
            <input data-testid={'keyMapChildElement'} />
          </HotKeys>

          <input data-testid={'siblingElement'} />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'handlerChildElement');
    });

    context('and a child element of the component defining the handlers is focused', function () {
      beforeEach(function () {
        this.input.getInstance().focus();
      });

      it.skip('renders the handlerChild input without a wrapper', function () {
        let html = this.wrapper.getByTestId("container").outerHTML;
        expect(html).to.equal('<div data-testid="container"><div tabindex="-1"><div><input data-testid="handlerChildElement" tabindex="-1"></div><input data-testid="keyMapChildElement"></div><input data-testid="siblingElement"></div>');
      });

      it('then calls the correct handler when a key is pressed that matches the keyMap', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.handler).to.have.been.called;
      });

      it('then does NOT call the handler when a key is pressed that does NOT matches the keyMap', function () {
        this.input.keyDown(KeyCode.TAB);

        expect(this.handler).to.not.have.been.called;
      });
    });

    context('and a child element of the component defining the keyMap is focused', function () {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'keyMapChildElement');
        this.input.focus();
      });

      it('then does NOT call the handler when a key is pressed that matches the keyMap', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.handler).to.not.have.been.called;
      });
    });

    context('and a sibling element is focused', function () {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'siblingElement');
        this.input.focus();
      });

      it('then does NOT calls the handler when a key is pressed that matches the keyMap', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.handler).to.not.have.been.called;
      });
    });
  });

  context('when HotKey components defining handlers are nested inside each other', function () {

    beforeEach(function () {
      this.outerEnterHandler = sinon.spy();
      this.outerTabHandler = sinon.spy();
      this.innerEnterHandler = sinon.spy();

      this.focusedInner = () => {
        return document.activeElement === this.innerElement.getInstance();
      }

      this.focusedOuter = () => {
        return this.outerContainer.contains(document.activeElement);
      }

      this.outerHandlers = {
        'ENTER': this.outerEnterHandler,
        'TAB': this.outerTabHandler,
      };

      this.innerHandlers = {
        'ENTER': this.innerEnterHandler,
      };

      const wrapperRef = createRef();
      const outerRef = createRef();
      const innerRef = createRef();

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} data-testid="container" id="level-a" attach={wrapperRef}>
          <div ref={wrapperRef}>
            <HotKeys noWrapper handlers={this.outerHandlers} focused={this.focusedOuter} id="level-b" attach={outerRef}>
              <div data-testid="myOwnWrapper" ref={outerRef}>
                <input data-testid="outerElement" />

                <HotKeys noWrapper handlers={this.innerHandlers} focused={this.focusedInner} id="level-c" attach={innerRef}>
                  <input data-testid="innerElement" ref={innerRef} />
                </HotKeys>
              </div>
            </HotKeys>
          </div>
        </HotKeys>
      );

      this.innerElement = new FocusableElement(this.wrapper, 'innerElement');
      this.outerContainer = this.wrapper.getByTestId('myOwnWrapper');
    });

    context('and a child element of the inner component is in focus', function () {
      beforeEach(function () {

        this.input = new FocusableElement(this.wrapper, 'innerElement');
        this.input.getInstance().focus();
      });

      it.skip('renders the innerElement and outerElement without a wrapper', function () {
        let html = this.wrapper.getByTestId("container").outerHTML;
        expect(html).to.equal('<div tabindex="-1" data-testid="container"><div><div data-testid="myOwnWrapper" tabindex="-1"><input data-testid="outerElement"><input data-testid="innerElement" tabindex="-1"></div></div></div>');
      });

      it('then only calls the handler defined in the inner component when a key is pressed for which handlers are defined in both components', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.innerEnterHandler).to.have.been.called;
        expect(this.outerEnterHandler).to.not.have.been.called;
      });

      it('then calls the handler defined in the outer component when a key is pressed that only the outer component has a handler for', function () {
        this.input.keyDown(KeyCode.TAB);

        expect(this.outerTabHandler).to.have.been.called;
      });

      it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', function () {
        this.input.keyDown(KeyCode.ALT);

        expect(this.innerEnterHandler).to.not.have.been.called;
        expect(this.outerTabHandler).to.not.have.been.called;
        expect(this.outerEnterHandler).to.not.have.been.called;
      });

    });

    context('and a child element of the outer component is in focus', function () {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'outerElement');
        this.input.getInstance().focus();
      });

      it('then only calls the handler defined in the outer component when a key is pressed for which handlers are defined in both components', function () {
        this.input.keyDown(KeyCode.ENTER);

        expect(this.innerEnterHandler).to.not.have.been.called;
        expect(this.outerEnterHandler).to.have.been.called;
      });

      it('then calls the handler defined in the outer component when a key is pressed that only the outer component has a handler for', function () {
        this.input.keyDown(KeyCode.TAB);

        expect(this.outerTabHandler).to.have.been.called;
      });

      it('then does not call any handlers when a key that doesn\'t match any handlers is pressed', function () {
        this.input.keyDown(KeyCode.ALT);

        expect(this.innerEnterHandler).to.not.have.been.called;
        expect(this.outerTabHandler).to.not.have.been.called;
        expect(this.outerEnterHandler).to.not.have.been.called;
      });

    });
  });
});
