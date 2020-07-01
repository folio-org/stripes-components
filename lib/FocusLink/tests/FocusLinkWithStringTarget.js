import React from 'react';
import { describe, beforeEach, it, afterEach } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './interactor';

const testId = 'test';

describe('FocusLink with string target', () => {
  const focusLink = new FocusLinkInteractor();
  let testInput;
  let focusSpy;

  afterEach(() => {
    focusSpy.resetHistory();
  });

  beforeEach(async () => {
    await mount(
      <FocusLink target={`#${testId}`}>
        Focus Link
        <input id={testId} />
      </FocusLink>
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
