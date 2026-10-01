import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import FocusableHarness from './FocusableHarness/FocusableHarness';
import { getNextFocusable, getPreviousFocusable } from '../getFocusableElements';
import { mount } from '../../tests/helpers';

describe('getFocusableElements', () => {
  const buttons = () => [...document.querySelectorAll('button')];
  const container = () => document.getElementById('container');

  beforeEach(async () => {
    await mount(<FocusableHarness />);
  });

  it('renders', () => {
    expect(buttons().length).to.equal(6);
  });

  describe('getNextFocusable', () => {
    it('with no parameters, it gets the first focusable element in the document', () => {
      expect(getNextFocusable().id).to.equal(buttons()[0].id);
    });

    it('gets the next focusable element', () => {
      expect(getNextFocusable(buttons()[0]).id).to.equal(buttons()[1].id);
    });

    it('gets the next focusable within a container', () => {
      expect(getNextFocusable(container(), true, true).id).to.equal(buttons()[2].id);
    });

    it('gets the next focusable excluding container contents', () => {
      expect(getNextFocusable(container(), false).id).to.equal(buttons()[4].id);
    });

    it('loops to the beginning of the document', () => {
      expect(getNextFocusable(buttons()[4]).id).to.equal(buttons()[0].id);
    });

    it('returns null if no querySelectorAll method is available', () => {
      expect(getNextFocusable({ test: true }, true, true)).to.equal(null);
    });

    it('returns same element if looping is false and last element provided', () => {
      expect(getNextFocusable(buttons()[4], true, false, false).id).to.equal(buttons()[4].id);
    });
  });

  describe('getPreviousFocusable', () => {
    it('gets the previous focusable element', () => {
      expect(getPreviousFocusable(buttons()[1]).id).to.equal(buttons()[0].id);
    });

    it('gets the previous focusable within a container', () => {
      expect(getPreviousFocusable(container(), true, true).id).to.equal(buttons()[3].id);
    });

    it('gets the previous focusable excluding container contents', () => {
      expect(getPreviousFocusable(container(), false).id).to.equal(buttons()[1].id);
    });

    it('loops to the end of the document', () => {
      expect(getPreviousFocusable(buttons()[0]).id).to.equal(buttons()[4].id);
    });

    it('returns null if no querySelectorAll method is available', () => {
      expect(getPreviousFocusable({ test: true }, true, true)).to.equal(null);
    });

    it('returns same element if looping is false and first element provided', () => {
      expect(getPreviousFocusable(buttons()[0], true, false, false).id).to.equal(buttons()[0].id);
    });
  });
});
