import React from 'react';
import { describe, beforeEach, it, afterEach } from 'mocha';
import sinon from 'sinon';
import { runAxeTest, converge } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './FocusLinkInteractor';

const targetObject = { focus: sinon.spy() };

describe('FocusLink with object target', () => {
  const focusLink = FocusLinkInteractor();

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

  it('shoud render link', () => focusLink.exists());

  it('has no axe errors - FocusLink', runAxeTest);

  describe('Clicking on focus link', () => {
    beforeEach(async () => {
      await focusLink.click();
    });

    it('should make the targed focused', () => converge(() => targetObject.focus.called));
  });
});
