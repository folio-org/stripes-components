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

import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Modal.css';
import IconButtonInteractor from '../../IconButton/tests/interactor';

const modalClassSelector = selectorFromClassnameString(`.${css.modalRoot}`);

export default interactor(class ModalInteractor {
  static defaultScope = modalClassSelector;
  closeButton = scoped(`.${css.closeModal}`, IconButtonInteractor);
  hasHeader = isPresent(`.${css.modalHeader}`);
  hasFooter = isPresent(`.${css.modalFooter}`);
  label = text(`.${css.modalLabel}`);
  ariaLabel = attribute('aria-label');
  isForm = is(`.${css.modal}`, 'form');
  backdrop = new Interactor(`.${css.backdrop}`);
});
