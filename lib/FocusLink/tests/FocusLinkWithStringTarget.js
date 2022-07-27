import React from 'react';
import { describe, beforeEach, it, afterEach } from 'mocha';
import sinon from 'sinon';
import { converge, Keyboard } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './FocusLinkInteractor';

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

  it('shoud render link', () => focusLink.exists());

  describe('Press on the Enter button', () => {
    beforeEach(async () => {
      await focusLink.focus();
      await Keyboard.pressKey('Enter');
    });

    it('should make the targed focused', () => converge(() => focusSpy.called));
  });
});
