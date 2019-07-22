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

  beforeEach(async () => {
    await mount(
      <KeyValue
        label="Label"
        value="Value"
      />
    );
  });

  it('should display label', () => {
    expect(keyValue.hasLabel).to.be.true;
  });

  it('should diplay correct label', () => {
    expect(keyValue.label).to.equal('Label');
  });

  it('should dispaly value', () => {
    expect(keyValue.hasValue).to.be.true;
  });

  it('should diplay correct value', () => {
    expect(keyValue.value).to.equal('Value');
  });
});
