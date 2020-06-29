import React from 'react';
import { describe, beforeEach, it, afterEach } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './interactor';

const targetObject = { focus: sinon.spy() };

describe('FocusLink with object target', () => {
  const focusLink = new FocusLinkInteractor();

  afterEach(() => {
    targetObject.focus.resetHistory();
  });

  beforeEach(async () => {
    await mount(
      <FocusLink target={targetObject}>
        Focus Link
      </FocusLink>
    );
  });

  it('shoud render link', () => {
    expect(focusLink.hasFocusLink).to.be.true;
  });

  describe('Clicking on focus link', () => {
    beforeEach(async () => {
      await focusLink.click();
    });

    it('should make the targed focused', () => {
      expect(targetObject.focus.called).to.be.true;
    });
  });
});
