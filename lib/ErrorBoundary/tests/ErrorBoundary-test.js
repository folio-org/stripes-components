/**
 * ErrorBoundary -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Interactor } from '@bigtest/interactor';
import { mountWithContext } from '../../../tests/helpers';
import ErrorBoundary from '../ErrorBoundary';
import { ErrorMessage, ProductionError } from '../components';
import { ErrorMessageInteractor, ProductionErrorInteractor } from './interactor';

describe('ErrorBoundary', () => {
  const dummyComponent = new Interactor('#wrapped-component');
  const errorMessage = new ErrorMessageInteractor();
  const productionError = new ProductionErrorInteractor();

  describe('When there are no errors', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorBoundary>
          <div id="wrapped-component" />
        </ErrorBoundary>
      );
    });

    it('Renders the wrapped component', () => {
      expect(dummyComponent.isPresent).to.be.true;
    });
  });

  describe('ErrorMessage', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorMessage
          id="errorMessage"
          error="Some error"
          stack="A stack trace"
        />
      );
    });

    it('Renders the error message', () => {
      expect(errorMessage.isPresent).to.be.true;
    });

    it('Renders the error', () => {
      expect(errorMessage.error.text).to.equal('Error: Some error');
    });

    it('Renders the stack trace', () => {
      expect(errorMessage.stackTrace.text).to.equal('A stack trace');
    });
  });

  describe('Production error', () => {
    let resetCallbackFired = false;
    let copyCallbackFired = false;

    beforeEach(async () => {
      await mountWithContext(
        <ProductionError
          error="Some error"
          onReset={() => { resetCallbackFired = true; }}
          onCopyError={() => { copyCallbackFired = true; }}
          resetButtonLabel="Go back"
          stackTrace="component stack"
          subTitle="Please go back"
          title="Some error occurred"
        />
      );
    });

    it('Renders the title', () => {
      expect(productionError.title.text).to.equal('Some error occurred');
    });

    it('Renders the sub title', () => {
      expect(productionError.subTitle.text).to.equal('Please go back View error details');
    });

    it('Should render a "more details"-button', () => {
      expect(productionError.detailsButton.isPresent).to.be.true;
    });

    it('Should render a reset button / cta', () => {
      expect(productionError.resetButton.text).to.equal('Go back');
    });

    describe('When a user clicks the reset button', () => {
      beforeEach(async () => {
        await productionError.resetButton.click();
      });

      it('Should fire the onReset-callback', () => {
        expect(resetCallbackFired).to.be.true;
      });
    });

    describe('When a user clicks the "More details"-button', () => {
      beforeEach(async () => {
        await productionError.detailsButton.click();
      });

      it('Renders the detail modal', () => {
        expect(productionError.detailsModal.isPresent).to.be.true;
      });

      it('Renders a "Copy error"-button in the modal footer', () => {
        expect(productionError.copyErrorButton.isPresent).to.be.true;
      });

      it('Renders the error message inside the modal', () => {
        expect(productionError.errorMessage.isPresent).to.be.true;
      });

      describe('When a user clicks the copy button', () => {
        beforeEach(async () => {
          await productionError.copyErrorButton.click();
        });

        it('Should fire the onCopyError-callback', () => {
          expect(copyCallbackFired).to.be.true;
        });
      });
    });
  });
});
