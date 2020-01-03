import React from 'react';
import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import NoValue from '../NoValue';

import { mountWithContext } from '../../../tests/helpers';
import NoValueInteractor from './interactor';

describe('NoValue', () => {
  const noValue = new NoValueInteractor();

  beforeEach(async () => {
    await mountWithContext(<NoValue />);
  });

  // Dummy test: make sure the component is present. I mean, duh.
  it('should display label', () => {
    expect(noValue.isPresent).to.be.true;
  });

  // Check that the attribute `role="text"` is present.
  // This is potentially controversial. Let me explain. role="text"
  // is not technically part of ARIA 1.1 and a span is usually considered
  // to be text anyway, so ... WTF? It's messy. The only thing inside this
  // span is a single dash character, which might not otherwise look like
  // text.
  it('should have a "role" attribute', () => {
    expect(noValue.roleAttribute).to.equal('text');
  });

  // Check to make sure an aria-label attribute, which is what will be read
  // by screenreaders in lieu of the text-value of the span.
  it('should have an "aria-label" attribute', () => {
    expect(noValue.ariaLabelAttribute).to.equal('No value set');
  });
});
