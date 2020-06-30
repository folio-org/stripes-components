import React from 'react';
import { describe, beforeEach, it, afterEach } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './interactor';

const testId = 'test';
const testComponent = 'div';
const targetNextAfter = () => <div />;

describe('FocusLink', () => {
  const focusLink = new FocusLinkInteractor();
  let testInput;
  let focusSpy;

  afterEach(() => {
    focusSpy.resetHistory();
  });

  beforeEach(async () => {
    await mount(
      <>
        <FocusLink component={testComponent}>
          Focus Link
        </FocusLink>
        <input id={testId} />
      </>
    );
    testInput = document.getElementById(testId);
    focusSpy = sinon.spy(testInput, 'focus');
  });

  it('shoud render link', () => {
    expect(focusLink.hasFocusLink).to.be.true;
  });

  describe('Press on the Enter button', () => {
    beforeEach(async () => {
      await focusLink.trigger('keypress', { keyCode: 13 });
    });

    it('should make the targed focused', () => {
      expect(focusSpy.called).to.be.true;
    });
  });
});

describe('FocusLink with targetNextAfter prop', () => {
  const focusLink = new FocusLinkInteractor();
  let focusSpy;
  let testNextInput;

  afterEach(() => {
    focusSpy.resetHistory();
  });

  beforeEach(async () => {
    await mount(
      <>
        <input id={testId} />
        <FocusLink targetNextAfter={targetNextAfter}>
          Focus Link
        </FocusLink>
      </>
    );
    testNextInput = document.getElementById(testId);
    focusSpy = sinon.spy(testNextInput, 'focus');
  });

  it('shoud render link', () => {
    expect(focusLink.hasFocusLink).to.be.true;
  });

  describe('Clicking on focus link', () => {
    beforeEach(async () => {
      await focusLink.click();
    });

    it('should make the targed focused', () => {
      expect(focusSpy.called).to.be.true;
    });
  });
});
