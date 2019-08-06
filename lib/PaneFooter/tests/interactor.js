import {
  interactor,
  property,
} from '@bigtest/interactor';

import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class PaneFooterInteractor {
  primaryButton = new ButtonInteractor('[data-test-pane-footer-primary-button]');
  secondaryButton = new ButtonInteractor('[data-test-pane-footer-secondary-button]');
  primaryButtonDisabled = property('[data-test-pane-footer-primary-button]', 'disabled');
});
