/**
 * Highlighter -> tests
 */

import React from 'react';
import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from 'mocha';

import Highlighter from '../Highlighter';

import { mount } from '../../../tests/helpers';
import HighlighterInteractor from './interactor';

describe('Highlighter', () => {
  const highlighter = new HighlighterInteractor();

  describe('if there are any search words', () => {
    beforeEach(async () => {
      await mount(
        <Highlighter
          searchWords={['walking', 'specification', 'frozen']}
          text="Walking on water and developing software from a specification are easy if both are frozen."
        />
      );
    });

    it('should have highligthed words', () => {
      expect(highlighter.highlightedWordCount).to.be.above(0);
    });
  });
});
