import React, { createRef } from 'react';
import { mount, setup } from '../setup';
import { expect } from 'chai';
import sinon from 'sinon';

import HotKeys from '../../HotKeys';
import KeyCode from '../support/KeyCode';
import FocusableElement from '../support/FocusableElement';

describe('Hard sequence handlers:', () => {
  setup();
  beforeEach(function () {
    this.hardSequenceHandler = sinon.spy();

    this.handlers = {
      'enter': this.hardSequenceHandler,
    };
  });

  describe('when the key sequence has not been associated with an action', () => {
    beforeEach(function () {
      const el = createRef();
      this.wrapper = mount(
        <div >
          <HotKeys handlers={this.handlers} id="outer" attach={el}>
            <input data-testid="childElement" ref={el} />
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
    });
  });

  describe('when the key sequence has been associated with an action in the same HotKeys component', () => {
    beforeEach(function () {
      const el = createRef();
      this.wrapper = mount(
        <div >
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={this.handlers} id="outer" attach={el}>
            <input data-testid="childElement" ref={el} />
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
    });
  });

  describe('when the key sequence has been associated with an action in a parent HotKeys component', () => {
    beforeEach(function () {
      const el = createRef();
      this.wrapper = mount(
        <div >

          <HotKeys actions={{ 'ENTER': 'enter' }} id="outer" attach={el}>
            <HotKeys handlers={this.handlers} id="inner" attach={el}>
              <input data-testid="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
    });
  });

  describe('when the key sequence has been associated with an action and has a handler in the same HotKeys component', () => {
    beforeEach(function () {
      this.otherHandler = sinon.spy();
      const el = createRef();

      this.wrapper = mount(
        <div >
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={{ 'ENTER': this.otherHandler, ...this.handlers }} id="outer" attach={el}>
            <input data-testid="childElement" ref={el} />
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
      expect(this.otherHandler).to.not.have.been.called;
    });
  });

  describe('when the key sequence has been associated with an action and has a handler in a parent HotKeys component', () => {
    beforeEach(function () {
      this.otherHandler = sinon.spy();
      const el = createRef();

      this.wrapper = mount(
        <div >
          <HotKeys actions={{ 'ENTER': 'enter' }} handlers={{ 'ENTER': this.otherHandler }} id="outer" attach={el}>
            <HotKeys handlers={this.handlers} id="inner" attach={el}>
              <input data-testid="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler when key sequence is pressed', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
      expect(this.otherHandler).to.not.have.been.called;
    });
  });

  describe('when the hard key sequence handler has been defined in a parent HotKeys component', () => {
    beforeEach(function () {
      this.outerHardSequenceHandler = sinon.spy();
      const el = createRef();

      this.wrapper = mount(
        <div >
          <HotKeys handlers={{ 'enter': this.outerHardSequenceHandler }} id="outer" attach={el}>
            <HotKeys handlers={this.handlers} id="inner" attach={el}>
              <input data-testid="childElement" ref={el} />
            </HotKeys>
          </HotKeys>

          <input data-testid="siblingElement" />
        </div>
      );

      this.input = new FocusableElement(this.wrapper, 'childElement');
      this.input.focus();
    });

    it('then calls the hard sequence handler in the child component', function () {
      this.input.keyDown(KeyCode.ENTER);

      expect(this.hardSequenceHandler).to.have.been.called;
      expect(this.outerHardSequenceHandler).to.not.have.been.called;
    });
  });
});
