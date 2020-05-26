import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import DefaultOptionFormatter from '../DefaultOptionFormatter';

import { OptionSegmentInteractor } from './interactor';

const mountDefaultOptionFormatter = ({ option }) => (
  mount(
    <DefaultOptionFormatter
      option={option}
      searchTerm="test"
    />
  )
);

describe('DefaultOptionFormatter', () => {
  const optionSegment = new OptionSegmentInteractor();

  describe('When option is defined', () => {
    beforeEach(async () => {
      await mountDefaultOptionFormatter({ option: { label: 'BY' } });
    });

    it('Than option segment is present', () => {
      expect(optionSegment.isPresent).to.be.true;
    });
  });

  describe('When option is not defined', () => {
    beforeEach(async () => {
      await mountDefaultOptionFormatter({ option: undefined });
    });

    it('Than option segment is not present', () => {
      expect(optionSegment.isPresent).to.be.false;
    });
  });
});
