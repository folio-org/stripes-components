import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { HTML } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import DefaultOptionFormatter from '../DefaultOptionFormatter';

const OptionSegmentInteractor = HTML.extend('option segment')
  .selector('[data-test-selection-option-segment]');

const mountDefaultOptionFormatter = ({ option }) => (
  mount(
    <DefaultOptionFormatter
      option={option}
      searchTerm="test"
    />
  )
);

describe('DefaultOptionFormatter', () => {
  const optionSegment = OptionSegmentInteractor();

  describe('When option is defined', () => {
    beforeEach(async () => {
      await mountDefaultOptionFormatter({ option: { label: 'BY' } });
    });

    it('Than option segment is present', () => optionSegment.exists());
  });

  describe('When option is not defined', () => {
    beforeEach(async () => {
      await mountDefaultOptionFormatter({ option: undefined });
    });

    it('Than option segment is not present', () => optionSegment.absent());
  });
});
