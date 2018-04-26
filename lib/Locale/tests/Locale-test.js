import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  interactor,
  text,
} from '@bigtest/interaction';

import { mount } from '../../../tests/helpers';

import withLocale, { LocaleContext } from '../../Locale';

describe('Locale', () => {
  let LocaleComponent = ({ locale }) => (
    <div data-test-locale>{locale}</div>
  );

  let LocaleComponentInteractor = interactor(class LocaleComponentInteractor {
    locale = text();
  });
  let testComponent = new LocaleComponentInteractor('[data-test-locale]');

  let WrappedLocaleComponent = withLocale(LocaleComponent);

  describe('without parent context', () => {
    describe('without a locale prop', () => {
      beforeEach(async () => {
        await mount(<WrappedLocaleComponent />);
      });

      it('passes the default locale', () => {
        expect(testComponent.locale).to.equal('en');
      });
    });

    describe('with a locale prop', () => {
      beforeEach(async () => {
        await mount(<WrappedLocaleComponent locale="zh" />);
      });

      it('uses the prop passed in', () => {
        expect(testComponent.locale).to.equal('zh');
      });
    });
  });

  describe('with parent context', () => {
    describe('without a locale prop', () => {
      beforeEach(async () => {
        await mount(
          <LocaleContext.Provider value="zh">
            <WrappedLocaleComponent />
          </LocaleContext.Provider>
        );
      });

      it('passes the locale from the context', () => {
        expect(testComponent.locale).to.equal('zh');
      });
    });

    describe('with a locale prop', () => {
      beforeEach(async () => {
        await mount(
          <LocaleContext.Provider value="zh">
            <WrappedLocaleComponent locale="de" />
          </LocaleContext.Provider>
        );
      });

      it('overrides the context with the prop', () => {
        expect(testComponent.locale).to.equal('de');
      });
    });
  });
});
