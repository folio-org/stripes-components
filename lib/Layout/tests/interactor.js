/**
 * Layout interactor
 */

import {
  interactor,
  attribute,
  property,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';

const modalClassSelector = selectorFromClassnameString('[data-test-layout]');

export default interactor(class ModalInteractor {
  static defaultScope = modalClassSelector;
  className = attribute('class');
  element = property('tagName');
});
