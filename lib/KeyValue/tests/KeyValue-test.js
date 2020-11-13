import React from 'react';

import {
  beforeEach,
  describe,
  it
} from "mocha";

import KeyValue from '../KeyValue';

import { mount, mountWithContext } from '../../../tests/helpers';
import { KeyValue as Interactor } from '@folio/stripes-testing';

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
     await keyValue.has({value: 'Value'});
    });

    it('should display a sub', async () => {
      await keyValue.has({subValue: 'subValue'});
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
      await keyValue.has({value: 'Children'});
    });
  });

  describe('with undefined value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={undefined} />
      );
    });

    it('should display correct value', async () => {
      await keyValue.has({value: '-'});
    });
  });

  describe('with empty string value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={''} />
      );
    });

    it('should display correct value', async () => {
      await keyValue.has({value: '-'});
    });
  });

  describe('with number 0 value', () => {
    beforeEach(async () => {
      await mountWithContext(
        <KeyValue label="Label" value={0} />
      );
    });

    it('should display correct value', async () => {
      await keyValue.has({value: '0'});
    });
  });
});
