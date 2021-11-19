/**
 * Callout interactor
 */

import {
  interactor,
  attribute,
  isPresent,
} from '@bigtest/interactor';

import css from '../Callout.css';

export default interactor(class CalloutInteractor {
  anyCalloutIsPresent = isPresent('[data-test-callout-element]');
  successCalloutIsPresent = isPresent('[data-test-callout-element][class*=success---]');
  errorCalloutIsPresent = isPresent('[data-test-callout-element][class*=error---]');
  infoCalloutIsPresent = isPresent('[data-test-callout-element][class*=info---]');
  warningCalloutIsPresent = isPresent('[data-test-callout-element][class*=warning---]');
  firstCalloutId = attribute('[data-test-callout-element]:first-child', 'id');
});
