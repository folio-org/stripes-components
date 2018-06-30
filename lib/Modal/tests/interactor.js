/**
 * Modal interactor
 */

import {
 interactor,
 is,
 attribute,
 hasClass,
 isPresent,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Modal.css';

const modalClassSelector = selectorFromClassnameString(`.${css.modal}`);

export default interactor(class ModalInteractor {
  static defaultScope = modalClassSelector;
  hasHeader = isPresent(`.${css.modalHeader}`);
});
