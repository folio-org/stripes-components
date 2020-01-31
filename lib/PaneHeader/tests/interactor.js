import {
  interactor,
  Interactor,
  text,
  scoped,
  attribute,
} from '@bigtest/interactor';

import IconButtonInteractor from '../../IconButton/tests/interactor';
import ButtonInteractor from '../../Button/tests/interactor';
import DropdownInteractor from '../../Dropdown/tests/interactor';

export default interactor(class RepeatableFieldInteractor {
  static defaultScope = '[data-test-pane-header]';

  actionsButton = new ButtonInteractor('[data-test-pane-header-actions-button]');
  actionsDropdown = new DropdownInteractor('[data-pane-header-actions-dropdown]');
  appIcon = scoped('[data-test-pane-header-app-icon');
  customHeader = new Interactor('[data-test-pane-header-custom]');
  dismissButton = new IconButtonInteractor('[data-test-pane-header-dismiss-button]');
  id = attribute('id')
  sub = text('[data-test-pane-header-sub]');
  title = text('[data-test-pane-header-title]');
});
