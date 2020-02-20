/**
 * Highlighter -> tests
 */

import React from 'react';
import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import Highlighter from '../Highlighter';

import { mount } from '../../../tests/helpers';
import HighlighterInteractor from './interactor';

describe('Highlighter', () => {
  const highlighter = new HighlighterInteractor();

  describe('without children', () => {
    beforeEach(async () => {
      await mount(
        <Highlighter />
      );
    });

    it('should display label', () => {
      expect(highlighter.label.isPresent).to.be.true;
    });
  });
});
