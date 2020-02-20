import React from 'react';
import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import KeyValue from '../KeyValue';

import { mount } from '../../../tests/helpers';
import KeyValueInteractor from './interactor';

describe('KeyValue', () => {
  const keyValue = new KeyValueInteractor();

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

    it('should display label', () => {
      expect(keyValue.label.isPresent).to.be.true;
    });

    it('should display correct label', () => {
      expect(keyValue.label.text).to.equal('Label');
    });

    it('should display value', () => {
      expect(keyValue.value.isPresent).to.be.true;
    });

    it('should display a sub', () => {
      expect(keyValue.sub.isPresent).to.be.true;
    });

    it('should display correct value', () => {
      expect(keyValue.value.text).to.equal('Value');
    });

    it('should have correct data-test attribute', () => {
      expect(keyValue.dataTestFoo).to.equal('bar');
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

    it('should display correct value', () => {
      expect(keyValue.value.text).to.equal('Children');
    });
  });
});
