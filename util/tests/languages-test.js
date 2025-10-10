import { describe, it } from 'mocha';
import { expect } from 'chai';

import languages, { formattedLanguageName, languageOptions, languageOptionsES } from '../languages';

describe('language functions', () => {
  const langs = {
    'stripes-components.languages.tlh': 'Shiny happy Klingons holding hands',
    'stripes-components.languages.zul': 'Two letters match',
    'stripes-components.languages.und': 'Undetermined',
  };

  const intl = {
    formatMessage: ({ id }) => langs[id] ?? id,
  }

  describe('formattedLanguageName', () => {
    describe('translates matched codes', () => {
      it('translates three-letter codes', () => {
        expect(formattedLanguageName('tlh', intl)).to.equal(langs['stripes-components.languages.tlh'])
      });

      it('translates two-letter codes', () => {
        expect(formattedLanguageName('zu', intl)).to.equal(langs['stripes-components.languages.zul'])
      });

      it('falls back to English name if translated name is missing', () => {
        const zxx = languages.find(i => i.alpha3 === 'zxx');
        expect(formattedLanguageName('zxx', intl)).to.equal(zxx.name);
      });
    });

    describe('returns undetermined given unmatched codes', () => {
      it('code is null', () => {
        expect(formattedLanguageName(null, intl)).to.equal(langs['stripes-components.languages.und']);
      });
      it('code is empty string', () => {
        expect(formattedLanguageName('', intl)).to.equal(langs['stripes-components.languages.und']);
      });
      it('code is whitespace', () => {
        expect(formattedLanguageName(' ', intl)).to.equal(langs['stripes-components.languages.und']);
      });
      it('code is unmatched', () => {
        expect(formattedLanguageName('kirk', intl)).to.equal(langs['stripes-components.languages.und']);
      });
    });

  });

  describe('languageOptions', () => {
    it('returns label/value tuples', () => {
      const list = languageOptions(intl);
      expect(list[0].label).not.to.equal(null);
      expect(list[0].value).not.to.equal(null);
    });

    it('sorts the list alphabetically in the current locale', () => {
      // atintl causes entries in atlangs to float to the top
      const atlangs = {
        'stripes-components.languages.zza': 'Zaza',
      };
      const atintl = {
        formatMessage: ({ id }) => atlangs[id] ? `@${id}` : id,
      }

      // zintl causes entries in zlangs to sink to the bottom
      const zlangs = {
        'stripes-components.languages.9an': 'Angloromani',
      };
      const zintl = {
        formatMessage: ({ id }) => zlangs[id] ? `ZZZ${id}` : id,
      }

      const atlist = languageOptions(atintl);
      const zlist = languageOptions(zintl);

      expect(atlist[0].value).to.equal('zza');
      expect(zlist[zlist.length - 1].value).to.equal('9an')
    });
  });

  describe('languageOptionsES', () => {
    const input = [
      { id: 'tlh', totalRecords: 271828 },
      { id: 'missing', totalRecords: 0 },
    ];

    it('returns label/value/count tuples when totalRecords is non-zero', () => {
      const list = languageOptionsES(intl, input);
      const tlh = list.find(i => i.value === 'tlh');

      expect(tlh.label).to.equal(langs['stripes-components.languages.tlh']);
      expect(tlh.value).to.equal(input[0].id);
      expect(tlh.count).to.equal(input[0].totalRecords);
    });

    it('omits entries where totalRecords is 0', () => {
      const list = languageOptionsES(intl, input);
      expect(list.length).to.equal(1);
      expect(list.find(i => i.value === 'missing')).to.be.undefined;
    });
  });
});
