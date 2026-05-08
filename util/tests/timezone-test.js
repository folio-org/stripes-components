import { it, describe } from 'mocha';
import { expect } from 'chai';
import timezones from '../timezones';

describe('timezones', () => {
  it('is an array of name/value objects', () => {
    expect(Array.isArray(timezones)).to.be.true;
    timezones.forEach(entry => {
      expect(entry.name).to.exist;
      expect(entry.value).to.exist;
    });
  });

  it('is sorted by name', () => {
    const a = timezones.at(0);
    const b = timezones.at(-1);
    expect(a.name.localeCompare(b.name)).to.be.below(0);
  });

  it('contains a UTC entry', () => {
    expect(timezones.find(entry => entry.name === 'UTC')).to.exist;
  });
});
