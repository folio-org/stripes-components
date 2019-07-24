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
          label="Label"
          value="Value"
        />
      );
    });

    it('should display label', () => {
      expect(keyValue.label.isPresent).to.be.true;
    });

    it('should diplay correct label', () => {
      expect(keyValue.label.text).to.equal('Label');
    });

    it('should dispaly value', () => {
      expect(keyValue.value.isPresent).to.be.true;
    });

    it('should diplay correct value', () => {
      expect(keyValue.value.text).to.equal('Value');
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

    it('should diplay correct value', () => {
      expect(keyValue.value.text).to.equal('Children');
    });
  });
});
