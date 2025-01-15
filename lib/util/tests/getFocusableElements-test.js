import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import FocusableHarness from './FocusableHarness/FocusableHarness';
import FocusableInteractor from './FocusableHarness/FocusableInteractor';
import { getNextFocusable, getPreviousFocusable } from '../getFocusableElements';
import { mount } from '../../../tests/helpers';

describe('getFocusableElements', () => {
  const focal = new FocusableInteractor();
  beforeEach(async () => {
    await mount(<FocusableHarness />);
  });

  it('renders', () => {
    expect(focal.buttons().length).to.equal(6);
  });

  describe('getNextFocusable', () => {
    it('with no parameters, it gets the first focusable element in the document', () => {
      expect(getNextFocusable().id).to.equal(focal.buttons(0).$root.id);
    });

    it('gets the next focusable element', () => {
      expect(getNextFocusable(focal.buttons(0).$root).id).to.equal(focal.buttons(1).$root.id);
    });

    it('gets the next focusable within a container', () => {
      expect(getNextFocusable(focal.container.$root, true, true).id).to.equal(focal.buttons(2).$root.id);
    });

    it('gets the next focusable excluding container contents', () => {
      expect(getNextFocusable(focal.container.$root, false).id).to.equal(focal.buttons(4).$root.id);
    });

    it('loops to the beginning of the document', () => {
      expect(getNextFocusable(focal.buttons(4).$root).id).to.equal(focal.buttons(0).$root.id);
    });

    it('returns null if no querySelectorAll method is available', () => {
      expect(getNextFocusable({ test: true }, true, true)).to.equal(null);
    });

    it('returns same element if looping is false and last element provided', () => {
      expect(getNextFocusable(focal.buttons(4).$root, true, false, false).id).to.equal(focal.buttons(4).$root.id);
    });
  });

  describe('getPreviousFocusable', () => {
    it('gets the previous focusable element', () => {
      expect(getPreviousFocusable(focal.buttons(1).$root).id).to.equal(focal.buttons(0).$root.id);
    });

    it('gets the previous focusable within a container', () => {
      expect(getPreviousFocusable(focal.container.$root, true, true).id).to.equal(focal.buttons(3).$root.id);
    });

    it('gets the previous focusable excluding container contents', () => {
      expect(getPreviousFocusable(focal.container.$root, false).id).to.equal(focal.buttons(1).$root.id);
    });

    it('loops to the end of the document', () => {
      expect(getPreviousFocusable(focal.buttons(0).$root).id).to.equal(focal.buttons(4).$root.id);
    });

    it('returns null if no querySelectorAll method is available', () => {
      expect(getPreviousFocusable({ test: true }, true, true)).to.equal(null);
    });

    it('returns same element if looping is false and first element provided', () => {
      expect(getPreviousFocusable(focal.buttons(0).$root, true, false, false).id).to.equal(focal.buttons(0).$root.id);
    });
  });
});
