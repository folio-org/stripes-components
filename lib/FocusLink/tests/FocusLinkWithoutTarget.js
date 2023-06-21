import React from 'react';
import { describe, beforeEach, it, afterEach } from 'mocha';
import sinon from 'sinon';
import { converge, Keyboard } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import FocusLink from '../FocusLink';
import FocusLinkInteractor from './FocusLinkInteractor';
import FocusLinkHarness from './FocusLinkHarness';

const testId = 'test';
const testComponent = 'div';
const targetNextAfter = () => <div />;

describe('FocusLink', () => {
  const focusLink = FocusLinkInteractor();
  let testInput;
  let focusSpy;

  afterEach(() => {
    if (focusSpy) {
      focusSpy.resetHistory();
    }
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
    if (testInput) {
      focusSpy = sinon.spy(testInput, 'focus');
    }
  });

  it('should render link', () => focusLink.exists());

  describe('Press on the Enter button', () => {
    beforeEach(async () => {
      await focusLink.focus();
      await Keyboard.pressKey('Enter');
    });

    it('should make the targed focused', () => converge(() => focusSpy.called));
  });
});

describe('FocusLink with targetNextAfter prop', () => {
  const focusLink = new FocusLinkInteractor();
  let focusSpy = sinon.spy();
  let testNextInput;

  afterEach(() => {
    if (focusSpy) {
      focusSpy.resetHistory();
    }
  });

  beforeEach(async () => {
    await mount(
      <>
        <input id={testId} />
        <FocusLinkHarness testId={'testId2'} targetOnFocus={focusSpy} listProps={{ tabIndex: 0 }}/>
      </>
    );
  });

  it('should render link', () => focusLink.exists());

  describe('Clicking on focus link', () => {
    beforeEach(async () => {
      await focusLink.click();
    });

    it('should make the targed focused', () => converge(() => { if(!focusSpy.called) throw (new Error('target not focused')); }));
  });
});
