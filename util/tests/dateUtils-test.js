import { beforeEach, it, describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { converge } from '@folio/stripes-testing';
import {
  getMomentLocalizedFormat,
  getLocaleDateFormat,
  getLocalizedTimeFormatInfo,
  DayRange,
  getDayJSLocalizedFormat,
  dayjs,
  getCompatibleDayJSLocale,
  loadDayJSLocale,
  formatLocalizedTime,
  parseLocalizedTime
} from '../dateTimeUtils';
import 'dayjs/locale/de';

// Keep this matrix aligned with stripes-core/src/loginServices.js::supportedLocales.
const supportedLocales = [
  'ar', 'cs-CZ', 'da-DK', 'de-DE', 'en-GB', 'en-SE', 'en-US', 'es-419', 'es-ES', 'es',
  'fr-FR', 'he', 'hi-IN', 'hu-HU', 'it-IT', 'ja', 'ko', 'nb', 'nl', 'nn', 'pl', 'pt-BR',
  'pt-PT', 'ru', 'sv', 'tr', 'uk', 'ur', 'zh-CN', 'zh-TW'
];


describe('Date Utilities', () => {
  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getMomentLocalizedFormat({ locale: 'de' });
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get localized format - dayJS fallback', () => {
    let format;
    beforeEach(async () => {
      format = getDayJSLocalizedFormat({ locale: 'de' });
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get locale date format - Germany', () => {
    let format;
    beforeEach(async () => {
      format = getLocaleDateFormat({ intl: { locale: 'de' } });
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get locale date format - Sweden', () => {
    let format;
    beforeEach(async () => {
      format = getLocaleDateFormat({ intl: { locale: 'sv' } });
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('YYYY-MM-DD');
    });
  });

  describe('get locale time format - Sweden', () => {
    let timeFormat;
    beforeEach(async () => {
      timeFormat = getLocalizedTimeFormatInfo('sv');
    });

    it('returns the time format according to the passed locale', () => {
      expect(timeFormat.timeFormat).to.equal('HH:mm');
    });

    it('returns an empty array of day perdiods', () => {
      expect(timeFormat.dayPeriods.length).to.equal(0);
    });
  });

  describe('get locale time format - en-US', () => {
    let timeFormat;
    beforeEach(async () => {
      timeFormat = getLocalizedTimeFormatInfo('en-US');
    });

    it('returns the time format according to the passed locale', () => {
      expect(timeFormat.timeFormat).to.equal('hh:mm A');
    });

    it('returns a separator', () => {
      expect(timeFormat.separator).to.equal(':');
    });

    it('returns an array of 2 day periods', () => {
      expect(timeFormat.dayPeriods.length).to.equal(2);
    });
  });

  describe('localized time periods', () => {
    it('parses and formats zh-TW day periods using Intl labels', () => {
      const parsedTime = parseLocalizedTime('下午4:20', 'Ah:mm', 'zh-TW');

      expect(parsedTime.isValid()).to.equal(true);
      expect(parsedTime.hour()).to.equal(16);
      expect(formatLocalizedTime(parsedTime, 'zh-TW', 'Ah:mm')).to.equal('下午4:20');
    });

    it('parses zh-TW morning values independently of DayJS locale data', () => {
      const parsedTime = parseLocalizedTime('上午4:20', 'Ah:mm', 'zh-TW');

      expect(parsedTime.isValid()).to.equal(true);
      expect(parsedTime.hour()).to.equal(4);
    });

    it('accepts a 24-hour numeric value with a localized day period', () => {
      const parsedTime = parseLocalizedTime('下午22:40', 'Ah:mm', 'zh-TW');

      expect(parsedTime.isValid()).to.equal(true);
      expect(parsedTime.hour()).to.equal(22);
      expect(parsedTime.minute()).to.equal(40);
    });

    it('preserves a 24-hour numeric value when the format uses HH', () => {
      const parsedTime = parseLocalizedTime('下午20:28', 'A HH:mm', 'zh-TW');

      expect(parsedTime.isValid()).to.equal(true);
      expect(parsedTime.hour()).to.equal(20);
      expect(parsedTime.minute()).to.equal(28);
    });

    supportedLocales.forEach(locale => {
      it(`parses before-noon and after-noon values for ${locale}`, () => {
        const timeFormat = getLocaleDateFormat({
          intl: { locale },
          config: { hour: 'numeric', minute: '2-digit' }
        });
        const beforeNoon = formatLocalizedTime(dayjs().hour(9).minute(28), locale, timeFormat);
        const afterNoon = formatLocalizedTime(dayjs().hour(20).minute(28), locale, timeFormat);
        const parsedBeforeNoon = parseLocalizedTime(beforeNoon, timeFormat, locale);
        const parsedAfterNoon = parseLocalizedTime(afterNoon, timeFormat, locale);

        expect(parsedBeforeNoon.isValid()).to.equal(true);
        expect(parsedBeforeNoon.hour()).to.equal(9);
        expect(parsedAfterNoon.isValid()).to.equal(true);
        expect(parsedAfterNoon.hour()).to.equal(20);
        expect(formatLocalizedTime(parsedBeforeNoon, locale, timeFormat)).to.equal(beforeNoon);
        expect(formatLocalizedTime(parsedAfterNoon, locale, timeFormat)).to.equal(afterNoon);
      });
    });
  });

  describe('get locale time format - ko', () => {
    let timeFormat;
    beforeEach(async () => {
      timeFormat = getLocalizedTimeFormatInfo('ko');
    });

    it('returns the time format according to the passed locale', () => {
      expect(timeFormat.timeFormat).to.equal('A hh:mm');
    });
  });

  describe('DayRange class', () => {
    const testRange = new DayRange(dayjs(), dayjs().add(7, 'days'));
    it('expands to array', () => {
      expect(testRange.asDayJSArray().length).equals(7);
    });

    it('isSame - queries equality (positive)', () => {
      expect(testRange.isSame(new DayRange(dayjs(), dayjs().add(7, 'days')))).equals(true);
    });

    it('isSame - queries equality (negative)', () => {
      expect(testRange.isSame(new DayRange(dayjs(), dayjs().add(8, 'days')))).equals(false);
    });

    it('contains - positive dayjs object', () => {
      expect(testRange.contains(dayjs().add(1, 'day'))).equals(true);
    });

    it('contains - positive dayRange', () => {
      expect(testRange.contains(new DayRange(dayjs().add(1, 'day'), dayjs().add(4, 'days')))).equals(true);
    });

    it('contains - negative dayjs object', () => {
      expect(testRange.contains(dayjs().subtract(1, 'day'))).equals(false);
    });

    it('contains - negative dayRange', () => {
      expect(testRange.contains(new DayRange(dayjs().subtract(1, 'day'), dayjs().add(4, 'days')))).equals(false);
    });

    it('overlaps - positive', () => {
      expect(testRange.overlaps(new DayRange(dayjs().subtract(2, 'days'), dayjs().add(4, 'days')))).equals(true);
    });

    it('overlaps - positive (same range)', () => {
      expect(testRange.overlaps(new DayRange(dayjs(), dayjs().add(8, 'days')))).equals(true);
    });

    it('overlaps - negative', () => {
      expect(testRange.overlaps(new DayRange(dayjs().subtract(7, 'days'), dayjs().subtract(4, 'days')))).equals(false);
    });
  });

  describe('getCompatibleDayJSLocale()', () => {
    let consoleSpy;
    beforeEach(() => {
      consoleSpy = sinon.spy(global.window.console, 'error');
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    it('returns the locale available for "SV"', () => {
      expect(getCompatibleDayJSLocale('sv-se', 'se')).equals('se');
      expect(consoleSpy.notCalled).to.be.true;
    });

    it('returns the locale available for "en-SE"', () => {
      expect(getCompatibleDayJSLocale('en-se', 'en')).equals('en');
      expect(consoleSpy.notCalled).to.be.true;
    });

    it('returns the locale available for "de"', () => {
      expect(getCompatibleDayJSLocale('de', 'de')).equals('de');
      expect(consoleSpy.notCalled).to.be.true;
    });

    it('logs an error for non-existent locale. "vo"', () => {
      expect(getCompatibleDayJSLocale('vo', 'fs')).equals(undefined);
      expect(consoleSpy.called).to.be.true;
    });
  });

  describe('loadDayJSLocale', () => {
    const localeCB = sinon.spy();
    beforeEach(() => {
      localeCB.resetHistory();
    });

    it('loads/sets locale to "de"', async () => {
      loadDayJSLocale('de', localeCB);
      await converge(() => { expect(localeCB.calledWith('de')).to.be.true; });
    });

    it('attempt to loads/set locale to "nph" - fallback to "en-US"', async () => {
      loadDayJSLocale('nph', localeCB);
      await converge(() => { expect(localeCB.calledWith('en-US')).to.be.true; });
    });

    it('loads 2 letter locale ("ru")', async () => {
      loadDayJSLocale('ru');
      await converge(() => { expect(dayjs.locale()).equals('ru'); });
    });

    it('loads parent language locale ("en-SE")', async () => {
      loadDayJSLocale('en-SE');
      await converge(() => { expect(dayjs.locale()).equals('en') });
    });

    it('resets locale if it is previously set to non-english locale', async () => {
      loadDayJSLocale('ru');
      await converge(() => { expect(dayjs.locale()).equals('ru'); });
      loadDayJSLocale('en-US');
      await converge(() => { expect(dayjs.locale()).equals('en'); });
    });

    it('writes error to console if locale is unavailable ("!e")', async () => {
      const mockConsoleError = sinon.spy(console, 'error');
      loadDayJSLocale('!e');
      await converge(() => { expect(mockConsoleError.calledOnce).to.be.true });
      await converge(() => { expect(dayjs.locale()).equals('en') });
      mockConsoleError.restore();
    });
  });
});
