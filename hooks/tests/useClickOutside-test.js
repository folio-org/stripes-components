import React, { useRef } from 'react';
import {
  describe,
  it,
  beforeEach,
  afterEach,
} from '@bigtest/mocha';
import {
  interactor,
  clickable,
} from '@bigtest/interactor';
import sinon from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from '../../tests/helpers';

import useClickOutside from '../useClickOutside';

const UseClickOutsideInteractor = interactor(class UseClickOutsideInteractor {
  static defaultScope ='#test-component';
  clickOutsideElement = clickable('#click-outside-element');
  clickInsideElement = clickable('#click-inside-element');
});

describe('useClickOutside', () => {
  const useClickOutsideInteractor = new UseClickOutsideInteractor();
  const onClickSpy = sinon.spy();

  const TestComponent = ({ onClick }) => {
    const content = useRef(null);

    useClickOutside(content, (e, isOutside) => {
      onClick(isOutside);
    });

    return (
      <div ref={content}>
        <span id="click-inside-element">Inside element</span>
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
      await useClickOutsideInteractor.clickOutsideElement();
    });

    it('should call onClick', () => {
      expect(onClickSpy.calledOnceWith(true)).to.be.true;
    });
  });

  describe('when clicking inside element', () => {
    beforeEach(async () => {
      await useClickOutsideInteractor.clickInsideElement();
    });

    it('should not call onClick', () => {
      expect(onClickSpy.calledOnceWith(false)).to.be.true;
    });
  });
});
