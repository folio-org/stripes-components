/**
 * Highlighter -> tests
 */

import React from 'react';

import {
  beforeEach,
  describe,
  it,
} from 'mocha';
import { HTML } from '@folio/stripes-testing';

import Highlighter from '../Highlighter';

import { mount } from '../../../tests/helpers';

const HighlighterInteractor = HTML.extend('highlighter')
  .selector('[data-test-highlighter]')
  .filters({
    wordCount: (el) => el.querySelectorAll('[data-test-highlighter-mark]').length
  });

describe('Highlighter', () => {
  const highlighter = HighlighterInteractor();

  describe('if there are any search words', () => {
    beforeEach(async () => {
      await mount(
        <Highlighter
          searchWords={['walking', 'specification', 'frozen']}
          text="Walking on water and developing software from a specification are easy if both are frozen."
        />
      );
    });

    it('should have highligthed words', () => highlighter.has({ wordCount: 3 }));
  });
});
