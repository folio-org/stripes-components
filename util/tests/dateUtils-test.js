import { beforeEach, it, describe } from 'mocha';
import { expect } from 'chai';
import { getLibraryLocalizedFormat, getLocaleDateFormat, getLocalizedTimeFormatInfo } from '../dateTimeUtils';

describe('Date Utilities', () => {
  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getLibraryLocalizedFormat({ locale: 'de' }); // eslint-disable-line
    });

    it('returns the long date format according to the passed locale', () => {
      expect(format).to.equal('DD.MM.YYYY');
    });
  });

  describe('get localized format - moment fallback', () => {
    let format;
    beforeEach(async () => {
      format = getLibraryLocalizedFormat({ locale: 'de' }); // eslint-disable-line
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
});
