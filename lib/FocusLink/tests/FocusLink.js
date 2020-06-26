import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './interactor';

const testId = 'test';

describe('FocusLink', () => {
  const focusLink = new FocusLinkInteractor();

  beforeEach(async () => {
    await mount(
      <FocusLink target={testId}>
        Focus Link
        <input id={testId} />
      </FocusLink>
    );
  });

  it('shoud render link', () => {
    expect(focusLink.hasFocusLink).to.be.true;
  });

  describe('Clicking on focus link', () => {
    let testInput;
    let focusSpy;

    beforeEach(async () => {
      testInput = document.getElementById(testId);
      focusSpy = sinon.spy(testInput, 'focus');
      await focusLink.click();
    });

    it('target should be focused', () => {
      expect(focusSpy.called).to.be.true;
    });
  });
});
