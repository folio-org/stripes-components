/**
 * ErrorBoundary -> tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { Bigtest, Button, converge, including, Modal } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';
import ErrorBoundary from '../ErrorBoundary';
import { ErrorMessage, ProductionError } from '../components';

const ErrorMessageInteractor = Bigtest.HTML.extend('Error boundary')
  .selector('[data-test-error-boundary-message]')
  .locator((el) => el.querySelector('[data-test-error-boundary-message-error]').textContent)
  .filters({
    stackTrace: (el) => el.querySelector('[data-test-error-boundary-message-stack-trace]').textContent
  });

const ProductionErrorInteractor = Bigtest.HTML.extend('Production error message')
  .selector('[data-test-error-boundary-production-error]')
  .locator((el) => el.querySelector('[data-test-error-boundary-production-error-title]').textContent)
  .filters({
    subTitle: (el) => el.querySelector('[data-test-error-boundary-production-error-sub-title]')?.textContent || '',
  })
  .actions({
    clickDetailsButton: ({ find }, label = 'details') => find(Bigtest.Button(including(label))).perform(el => el.click()),
    clickResetButton: (interactor, label = 'Go back') => Button(including(label)).click(),
  });

const DetailsModalInteractor = Modal.extend('details modal')
  .selector('[data-test-error-boundary-production-error-details-modal]')
  .actions({
    clickCopyButton: ({ find }, label = 'Copy') => find(Button(including(label))).perform(el => el.click()),
  });

describe('ErrorBoundary', () => {
  const dummyComponent = Bigtest.HTML({ id: 'wrapped-component', visible: false });
  const errorMessage = ErrorMessageInteractor();
  const productionError = ProductionErrorInteractor();
  const detailsModal = DetailsModalInteractor();

  describe('When there are no errors', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorBoundary>
          <div id="wrapped-component" />
        </ErrorBoundary>
      );
    });

    it('Renders the wrapped component', () => dummyComponent.exists());
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

    it('Renders the error message', () => errorMessage.exists());

    it('Renders the error', () => ErrorMessageInteractor('Error: Some error').exists());

    it('Renders the stack trace', () => errorMessage.has({ stackTrace: 'A stack trace' }));
  });

  describe('Production error', () => {
    let resetCallbackFired = false;
    let copyCallbackFired = false;

    beforeEach(async () => {
      const stackTrace = 'component stack';
      const mapStackTrace = (_stack, callback, _options) => {
        callback([stackTrace]);
      };

      await mountWithContext(
        <ProductionError
          error="Some error"
          onReset={() => { resetCallbackFired = true; }}
          onCopyError={() => { copyCallbackFired = true; }}
          resetButtonLabel="Go back"
          stackTrace={stackTrace}
          subTitle="Please go back"
          title="Some error occurred"
          mapStackTrace={mapStackTrace}
        />
      );

      await converge(() => Bigtest.Button(including('details')).exists());
    });

    it('Renders the title', () => ProductionErrorInteractor('Some error occurred').exists());

    it('Renders the sub title', () => productionError.has({ subTitle: 'Please go back View error details' }));

    it('Should render a "more details"-button', () => Bigtest.Button(including('details')).exists());

    it('Should render a reset button / cta', () => Button('Go back').exists());

    describe('When a user clicks the reset button', () => {
      beforeEach(async () => {
        await productionError.clickResetButton();
      });

      it('Should fire the onReset-callback', () => converge(() => resetCallbackFired));
    });

    describe('When a user clicks the "More details"-button', () => {
      beforeEach(async () => {
        await productionError.clickDetailsButton();
      });

      it('Renders the detail modal', () => detailsModal.exists());

      it('Renders a "Copy error"-button in the modal footer', () => Button(including('Copy')).exists());

      it('Renders the error message inside the modal', () => errorMessage.exists());

      describe('When a user clicks the copy button (with callback)', () => {
        beforeEach(async () => {
          await detailsModal.clickCopyButton();
        });

        it('Should fire the onCopyError-callback', () => converge(() => copyCallbackFired));
      });
    });

    describe('When a user clicks the "More details"-button', () => {
      describe('When a user clicks the copy button (without callback)', () => {
        const stackTrace = 'stacktrace';
        const mapStackTrace = (_stack, callback, _options) => {
          callback([stackTrace]);
        };
        const copySpy = sinon.spy();
        const stub = sinon.stub(navigator.clipboard, 'writeText')
          .callsFake((str) => Promise.resolve(copySpy(str)));

        beforeEach(async () => {
          await mountWithContext(
            <ProductionError
              error="Some error"
              onReset={() => { resetCallbackFired = true; }}
              resetButtonLabel="Go back"
              stackTrace={stackTrace}
              subTitle="Please go back"
              title="Some error occurred"
              mapStackTrace={mapStackTrace}
            />
          );

          await converge(() => Bigtest.Button(including('details')).exists());
          await productionError.clickDetailsButton();
          await detailsModal.clickCopyButton();
        });

        it('The copy-button label changes, and it disables', () => Button(including('Copied')).is({ disabled: true }));
        it('Stacktrace is copied to the clipboard', () => {
          expect(stub.called).to.be.true;
        });
      });
    });
  });

  describe('Production error with a sourcemap', () => {
    const mappedStackText = 'mapped stacktrace';
    beforeEach(async () => {
      const mapStackTrace = (_stack, callback, _options) => {
        callback([mappedStackText]);
      };

      await mountWithContext(
        <ProductionError
          error="Some error"
          resetButtonLabel="Go back"
          stackTrace="component stack"
          subTitle="Please go back"
          title="Some error occurred"
          mapStackTrace={mapStackTrace}
        />
      );

      await converge(() => Bigtest.Button(including('details')).exists());
      await productionError.clickDetailsButton();
    });

    it('Renders the mapped stacktrace inside the modal', () => errorMessage.has({ stackTrace: mappedStackText }));
  });

  describe('Production error without a sourcemap', () => {
    const stackTrace = 'raw stacktrace';
    beforeEach(async () => {
      const mapStackTrace = (_stack, callback, _options) => {
        callback([]);
      };

      await mountWithContext(
        <ProductionError
          error="Some error"
          resetButtonLabel="Go back"
          stackTrace={stackTrace}
          subTitle="Please go back"
          title="Some error occurred"
          mapStackTrace={mapStackTrace}
        />
      );

      await converge(() => Bigtest.Button(including('details')).exists());
      await productionError.clickDetailsButton();
    });

    it('Renders the original stacktrace inside the modal', () => errorMessage.has({ stackTrace }));
  });
});
