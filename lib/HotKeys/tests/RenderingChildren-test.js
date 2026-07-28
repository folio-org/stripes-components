import React, { createRef } from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from '../../../tests/helpers';
import HotKeys from '../HotKeys';
import contains from '../contains';

describe('Rendering children', () => {
  const keyMap = {
    'ENTER': 'enter',
    'TAB': 'tab',
  };

  describe('when the component prop is not defined', () => {
    let wrapperRef;

    beforeEach(async () => {
      const handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();
      wrapperRef = createRef();

      await mount(
        <div ref={wrapperRef}>
          <HotKeys keyMap={keyMap} handlers={handlers} id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>
        </div>
      );
    });

    it('then renders its children wrapped in a div', () => {
      const div = wrapperRef.current.firstChild;
      const input = wrapperRef.current.querySelector('[aria-label="childElement"]');
      expect(contains(div, input)).to.be.true;
    });

    it('then sets a tabIndex of -1', () => {
      const div = wrapperRef.current.firstChild;
      expect(div.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('when the component prop is a string', () => {
    let wrapperRef;

    beforeEach(async () => {
      const handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();
      wrapperRef = createRef();

      await mount(
        <div ref={wrapperRef}>
          <HotKeys keyMap={keyMap} handlers={handlers} component="span" id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>
        </div>
      );
    });

    it('then renders its children wrapped in a component matching the string', () => {
      const div = wrapperRef.current.firstChild;
      const input = wrapperRef.current.querySelector('[aria-label="childElement"]');
      expect(contains(div, input)).to.be.true;
    });

    it('then sets a tabIndex of -1', () => {
      const div = wrapperRef.current.firstChild;
      expect(div.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('when the noWrapper prop is true', () => {
    let wrapperRef;

    beforeEach(async () => {
      const handler = sinon.spy();

      const handlers = {
        'ENTER': handler,
      };

      const el = createRef();
      wrapperRef = createRef();

      await mount(
        <div ref={wrapperRef}>
          <HotKeys noWrapper keyMap={keyMap} handlers={handlers} component="span" id="outer" attach={el}>
            <input aria-label="childElement" ref={el} />
          </HotKeys>
        </div>
      );
    });

    it('then renders children without a wrapping element', () => {
      const html = wrapperRef.current.innerHTML;
      expect(html).to.equal('<input aria-label="childElement" tabindex="-1">');
    });
  });
});
