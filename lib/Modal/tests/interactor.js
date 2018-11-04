/**
 * Modal interactor
 */

import {
  Interactor,
  interactor,
  is,
  isPresent,
  text,
  attribute,
  clickable,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Modal.css';

const modalClassSelector = selectorFromClassnameString(`.${css.modal}`);

export default interactor(class ModalInteractor {
  static defaultScope = modalClassSelector;
  hasCloseButton = isPresent(`.${css.closeModal}`);
  clickCloseButton = clickable(`.${css.closeModal}`);
  hasHeader = isPresent(`.${css.modalHeader}`);
  hasFooter = isPresent(`.${css.modalFooter}`);
  label = text(`.${css.modalLabel}`);
  ariaLabel = attribute('aria-label');
  isForm = is('form');
  backdrop = new Interactor(`.${css.backdrop}`);
});
