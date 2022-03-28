import React from 'react';

import {
  beforeEach,
  describe,
  it
} from 'mocha';

import { NoValue as Interactor } from '@folio/stripes-testing';
import NoValue from '../NoValue';
import translations from '../../../translations/stripes-components/en';

import { mountWithContext } from '../../../tests/helpers';

describe('NoValue', () => {
  const noValue = Interactor();

  describe('without aria-label', () => {
    beforeEach(async () => {
      await mountWithContext(
        <NoValue />
      );
    });

    it('should display default screen value', async () => {
      await noValue.has({ emptyScreenValue: true });
    });

    it('should display default sr-only value', async () => {
      await noValue.has({ ariaValue: translations['noValue.noValueSet'] });
    });
  });

  describe('with empty aria-label', () => {
    beforeEach(async () => {
      await mountWithContext(
        <NoValue ariaLabel="" />
      );
    });

    it('should display default screen value', async () => {
      await noValue.has({ emptyScreenValue: true });
    });

    it('should display default sr-only value', async () => {
      await noValue.has({ ariaValue: translations['noValue.noValueSet'] });
    });
  });

  describe('with non-empty aria-label', () => {
    const s = 'this is not the value you\'re looking for';
    beforeEach(async () => {
      await mountWithContext(
        <NoValue ariaLabel={s} />
      );
    });

    it('should display default screen value', async () => {
      await noValue.has({ emptyScreenValue: true });
    });

    it('should display custom sr-only value', async () => {
      await noValue.has({ ariaValue: s });
    });
  });
});
