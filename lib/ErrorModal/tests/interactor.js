import {
  interactor,
  scoped,
  computed,
  Interactor,
} from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

import css from '../../Modal/Modal.css';

const tagName = selector => computed(function () {
  return this.$(selector).tagName.toLowerCase();
});

export default interactor(class ErrorModalInteractor {
  label = new Interactor('[class*=modalLabel---]');
  content = new Interactor('[data-test-error-modal-content]');
  bodyTagName = tagName('[data-test-error-modal-content]');
  closeButton = scoped('[data-test-error-modal-close-button]', ButtonInteractor);
});
