import React, { createRef } from 'react';
import { mount, setup } from '../setup';
import { expect } from 'chai';
import sinon from 'sinon';

import HotKeys from '../../HotKeys';
import KeyCode from '../support/KeyCode';
import FocusableElement from '../support/FocusableElement';

describe('Component lifecycle:', () => {
  setup();
  before(function () {
    this.keyMap = {
      'ENTER': 'enter',
      'TAB': 'tab',
    };
  });

  context('when component mounts', () => {

    beforeEach(function () {
      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };

      const el = createRef();

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={handlers} attach={el}>
          <input data-testid="childElement" ref={el} />
        </HotKeys>
      );

    });

    it('then none of the handlers are called', function () {
      expect(this.handler).to.not.have.been.called;
    });

    context('and focused', () => {
      beforeEach(function () {
        this.input = new FocusableElement(this.wrapper, 'childElement');
        this.input.focus();
      });

      it('then none of the handlers are called', function () {
        expect(this.handler).to.not.have.been.called;
      });

      context('and a key matching a hot key is pressed', () => {
        it('then calls the correct handler', function () {
          this.input.keyDown(KeyCode.ENTER);

          expect(this.handler).to.have.been.called;
        });
      });
    });

  });

  context('when the component has been unmounted', () => {
    beforeEach(function () {
      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };
      const el = createRef();

      this.wrapper = mount(
        <div >
          <HotKeys keyMap={this.keyMap} handlers={handlers} attach={el}>
            <input data-testid="childElement" ref={el} />
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();

      this.wrapper.unmount();
    });

    it('then does not call the handler when a key matching a hot key is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.handler).to.not.have.been.called;
    });
  });

});
