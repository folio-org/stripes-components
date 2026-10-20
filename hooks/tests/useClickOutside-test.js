import React, { useRef } from 'react';
import {
  describe,
  it,
  beforeEach,
  afterEach,
} from 'mocha';
import { Button, HTML } from '@folio/stripes-testing';
import sinon from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from '../../tests/helpers';

import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
  const clickOutsideElement = HTML({ id: 'click-outside-element' });
  const clickInsideElement = Button({ id: 'click-inside-element' });
  const onClickSpy = sinon.spy();

  const TestComponent = ({ onClick }) => {
    const content = useRef(null);

    useClickOutside(content, (e, isOutside) => {
      onClick(isOutside);
    });

    return (
      <div ref={content}>
        <button
          id="click-inside-element"
          type="button"
          onClick={(e) => e.target.parentNode.removeChild(e.target)}
        >
          Inside element
        </button>
      </div>
    );
  };

  beforeEach(async () => {
    onClickSpy.resetHistory();

    await mountWithContext(
      <div id="test-component">
        <TestComponent onClick={onClickSpy} />
        <p id="click-outside-element">Outside element</p>
      </div>
    );
  });

  afterEach(() => {
    onClickSpy.resetHistory();
  });

  describe('when clicking outside element', () => {
    beforeEach(async () => {
      await clickOutsideElement.click();
    });

    it('should call onClick', () => {
      expect(onClickSpy.calledOnceWith(true)).to.be.true;
    });
  });

  describe('when clicking inside element', () => {
    beforeEach(async () => {
      await clickInsideElement.click();
    });

    it('should not call onClick', () => {
      expect(onClickSpy.calledOnceWith(false)).to.be.true;
    });
  });

  describe('when other click handler removes click target from DOM', () => {
    beforeEach(async () => {
      await clickInsideElement.click();
    });

    it('should still give correct results', () => {
      expect(onClickSpy.calledOnceWith(false)).to.be.true;
    });
  });
});
