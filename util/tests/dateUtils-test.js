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
  dayjsTz,
  getCompatibleDayJSLocale,
  loadDayJSLocale
} from '../dateTimeUtils';
import 'dayjs/locale/de';
import { de } from 'faker/lib/locales';


describe('Date Utilities', () => {
  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getMomentLocalizedFormat({ locale: 'de' }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get localized format - dayJS fallback', () => {
    let format;
    beforeEach(async () => {
      format = getDayJSLocalizedFormat({ locale: 'de' }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get locale date format - Germany', () => {
    let format;
    beforeEach(async () => {
      format = getLocaleDateFormat({ intl: { locale: 'de' } }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get locale date format - Sweden', () => {
    let format;
    beforeEach(async () => {
      format = getLocaleDateFormat({ intl: { locale: 'sv' } }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('YYYY-MM-DD');
    });
  });

  describe('get locale time format - Sweden', () => {
    let timeFormat;
    beforeEach(async () => {
      timeFormat = getLocalizedTimeFormatInfo('sv'); // eslint-disable-line
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
      timeFormat = getLocalizedTimeFormatInfo('en-US'); // eslint-disable-line
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

  describe('get locale time format - ko', () => {
    let timeFormat;
    beforeEach(async () => {
      timeFormat = getLocalizedTimeFormatInfo('ko'); // eslint-disable-line
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
    let localeCB = sinon.spy();
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

  describe.only('dayjsTz', () => {
    it('converts time to specified timezone', () => {
      const dateInUtc = '2024-06-01T12:00:00Z';
      const tzDate = dayjsTz(dateInUtc, 'America/Los_Angeles');
      expect(tzDate.format()).to.equal('2024-06-01T12:00:00-07:00');
    });

    it('uses setDefault', () => {
      const dateInUtc = '2024-06-01T12:00:00Z';
      dayjs.tz.setDefault('America/Los_Angeles');
      const tzDate = dayjsTz(dateInUtc);
      expect(tzDate.format()).to.equal('2024-06-01T12:00:00-07:00');
    });

    it('setDefault and strictly dayjsTz', () => {
      const dateInUtc = '2024-06-01T12:00:00Z';
      dayjsTz.setDefault('America/Los_Angeles');
      const tzDate = dayjsTz(dateInUtc);
      expect(tzDate.format()).to.equal('2024-06-01T12:00:00-07:00');
    });

    it('misuse setDefault', () => {
      const dateInUtc = '2024-06-01T12:00:00Z';
      dayjs.tz.setDefault('America/Los_Angeles');
      const wrongDate = dayjs(dateInUtc); // local timezone used...
      // output is smth like '2024-06-01T07:00:00-05:00'
      expect(wrongDate.format()).to.not.equal('2024-06-01T12:00:00-07:00');
    });

    it('body of func', () => {
      const BuildDateSentence = (dateInUtc) => {
        const tzDate = dayjs.tz(dateInUtc);
        return `result: ${tzDate.format()}`;
      }
      const dateInUtc = '2024-06-01T12:00:00Z';
      dayjsTz.setDefault('America/Los_Angeles');
      let res = BuildDateSentence(dateInUtc);
      expect(res).to.equal('result: 2024-06-01T12:00:00-07:00');

      dayjs.tz.setDefault();
      res = BuildDateSentence(dateInUtc);
      expect(res).to.not.equal('result: 2024-06-01T12:00:00-07:00');
    });
  });
});
