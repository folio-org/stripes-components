import React from 'react';
import { describe, beforeEach, it, afterEach } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './interactor';

const testId = 'test';

describe('FocusLink', () => {
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

  describe('Clicking on focus link', () => {

    beforeEach(async () => {
      await focusLink.click();
    });

    it('should make the targed focused', () => {
      expect(focusSpy.called).to.be.true;
    });
  });
});
