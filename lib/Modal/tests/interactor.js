/**
 * Modal interactor
 */

import {
  Interactor,
  interactor,
  is,
  isPresent,
  text,
  scoped,
  attribute,
} from '@bigtest/interactor';

import IconButtonInteractor from '../../IconButton/tests/interactor';

export default interactor(class ModalInteractor {
  static defaultScope = '[class*=modalRoot---]';
  closeButton = scoped('[class*=closeModal---]', IconButtonInteractor);
  hasHeader = isPresent('[class*=modalHeader---]');
  hasFooter = isPresent('[class*=modalFooter---]');
  label = text('[class*=modalLabel---]');
  ariaLabel = attribute('aria-label');
  isForm = is('[class*=modal---]', 'form');
  backdrop = new Interactor('[class*=backdrop---]');
});
