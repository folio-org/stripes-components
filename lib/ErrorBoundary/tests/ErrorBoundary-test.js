/**
 * ErrorBoundary -> tests
 */

import React, { useState } from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Interactor } from '@bigtest/interactor';
import { mountWithContext } from '../../../tests/helpers';
import Harness from '../../../tests/Harness';
import Button from '../../Button';
import ButtonInteractor from '../../Button/tests/interactor';
import ErrorBoundary from '../ErrorBoundary';
import ErrorBoundaryInteractor from './interactor';

const DummyComponent = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Error thrown from problem child');
  }

  return (
    <div id="dummy-component">
      <Button id="trigger-error-button" onClick={() => setHasError(true)}>
        Trigger error
      </Button>
    </div>
  );
};

describe.only('ErrorBoundary', () => {
  const errorBoundary = new ErrorBoundaryInteractor();
  const dummyComponent = new Interactor('#dummy-component');
  const triggerErrorButton = new ButtonInteractor('#trigger-error-button');

  describe('When the wrapped component is working correctly', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorBoundary layout="production">
          <DummyComponent />
        </ErrorBoundary>
      );
    });

    it('Renders the wrapped component', () => {
      expect(dummyComponent.isPresent).to.be.true;
    });
  });

  describe('When the wrapped component fails to render', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorBoundary layout="production">
          <DummyComponent />
        </ErrorBoundary>
      );

      await triggerErrorButton.click();
    });

    it('Renders the error message', () => {
      expect(errorBoundary.isPresent).to.be.true;
    });

    it('Renders an error title', () => {
      expect(errorBoundary.title.isPresent).to.be.true;
    });

    it('Renders an error sub title', () => {
      expect(errorBoundary.subTitle.isPresent).to.be.true;
    });
  });
});
