import React from 'react';

import {
  beforeEach,
  describe,
  it
} from 'mocha';

import {
  KeyValue as Interactor,
  NoValue as NoValueInteractor,
  runAxeTest,
} from '@folio/stripes-testing';

import KeyValue from '../KeyValue';
import { mount, mountWithContext } from '../../../tests/helpers';

describe('KeyValue', () => {
  const keyValue = Interactor('Label');

  describe('without children', () => {
    beforeEach(async () => {
      await mount(
        <KeyValue
          data-test-foo="bar"
          label="Label"
          value="Value"
          subValue="subValue"
        />
      );
    });

    it('should display label', async () => {
      // expect(keyValue.label.isPresent).to.be.true;
      await keyValue.exists();
    });

    it('should display value', async () => {
      await keyValue.has({ value: 'Value' });
    });

    it('should display a sub', async () => {
      await keyValue.has({ subValue: 'subValue' });
    });

    it('should not have axe isssues', async () => {
      await runAxeTest();
    });
  });

  describe('with children', () => {
    beforeEach(async () => {
      await mount(
        <KeyValue label="Label">
          {'Children'}
        </KeyValue>
      );
    });

    it('should display correct value', async () => {
      await keyValue.has({ value: 'Children' });
    });
  });

  describe('with undefined value', () => {
    const noValue = NoValueInteractor();

    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={undefined} />
      );
    });

    it('should display correct value', async () => {
      await noValue.exists();
    });

    it('should not have axe isssues', async () => {
      await runAxeTest();
    });
  });

  describe('with empty string value', () => {
    const noValue = NoValueInteractor();

    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={''} />
      );
    });

    it('should display correct value', async () => {
      await noValue.exists();
    });

    it('should not have axe isssues', async () => {
      await runAxeTest();
    });
  });

  describe('with number 0 value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={0} />
      );
    });

    it('should display correct value', async () => {
      await keyValue.has({ value: '0' });
    });

    it('should not have axe isssues', async () => {
      await runAxeTest();
    });
  });
});
