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


  describe('when aria-label is not passed from parent', () => {
    beforeEach(async () => {
      await mountWithContext(<NoValue />);
    });

    // Check to make sure an aria-label attribute, which is what will be read
    // by screenreaders in lieu of the text-value of the span.
    it('should have a default "aria-label" attribute', () => {
      expect(noValue.ariaLabelAttribute).to.equal('No value set');
    });
  });

  describe('when aria-label was passed from parent', () => {
    const ariaLabel = 'No custom value set';

    beforeEach(async () => {
      await mountWithContext(<NoValue ariaLabel={ariaLabel} />);
    });

    // Check to make sure that aria-label attribute has value passed down
    // from parent component
    it('should have a custom "aria-label" attribute', () => {
      expect(noValue.ariaLabelAttribute).to.equal(ariaLabel);
    });
  });
});
