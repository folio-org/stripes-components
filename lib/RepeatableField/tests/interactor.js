import {
  clickable,
  collection,
  interactor,
  isPresent,
  text,
  property,
} from '@bigtest/interactor';

const ADD_BTN_SELECTOR = '[data-test-repeatable-field-add-item-button]';
const REMOVE_BTN_SELECTOR = '[data-test-repeatable-field-remove-item-button]';

const RepeatableFieldItemInteractor = interactor(class RepeatableFieldItemInteractor {
  clickRemoveButton = clickable(REMOVE_BTN_SELECTOR);
  isRemoveDisabled = property(REMOVE_BTN_SELECTOR, 'disabled');
});

export default interactor(class RepeatableFieldInteractor {
  static defaultScope = '[data-test-repeatable-field]';

  hasAddButton = isPresent(ADD_BTN_SELECTOR);
  clickAddButton = clickable(ADD_BTN_SELECTOR);
  legend = text('[data-test-repeatable-field-legend]');
  emptyMessage = text('[data-test-repeatable-field-empty-message]');

  items = collection('li', RepeatableFieldItemInteractor);

  isAddDisabled = property('[data-test-repeatable-field-add-item-button]', 'disabled');
});
