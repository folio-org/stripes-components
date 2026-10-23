import { describe, it } from 'mocha';
import { expect } from 'chai';

import { filters2cql } from '../FilterGroups';

const config = [
  {
    label: 'Item Types',
    name: 'item',
    cql: 'materialType',
    values: ['Books', 'DVDs', 'Microfilm'],
  },
  {
    label: 'Location',
    name: 'location',
    cql: 'location.name',
    values: [{ name: 'Main Library', cql: 'main' }, 'Annex'],
  },
  {
    label: 'Release',
    name: 'release',
    cql: 'release',
    values: ['4', '5', '5.1', '5.1.2'],
  },
];

describe('filters2cql', () => {
  it('returns undefined without filters', () => {
    expect(filters2cql(config, '')).to.equal(undefined);
  });

  it('builds a condition for a single filter', () => {
    expect(filters2cql(config, 'item.Books')).to.equal('materialType=="Books"');
  });

  it('combines filters of one group with "or" and groups with "and"', () => {
    expect(filters2cql(config, 'item.DVDs,item.Microfilm,location.Main Library'))
      .to.equal('materialType==("DVDs" or "Microfilm") and location.name=="main"');
  });

  it('keeps a filter name that contains the group separator', () => {
    expect(filters2cql(config, 'release.5.1')).to.equal('release=="5.1"');
  });

  it('keeps a filter name that contains the group separator more than once', () => {
    expect(filters2cql(config, 'release.5.1.2')).to.equal('release=="5.1.2"');
  });

  it('distinguishes a filter name from its prefix before the separator', () => {
    expect(filters2cql(config, 'release.5,release.5.1')).to.equal('release==("5" or "5.1")');
  });
});
