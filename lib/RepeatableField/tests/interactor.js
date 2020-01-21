import {
  clickable,
  collection,
  interactor,
  isPresent,
  text,
  property,
  attribute,
} from '@bigtest/interactor';

const ADD_BTN_SELECTOR = '[data-test-repeatable-field-add-item-button]';
const REMOVE_BTN_SELECTOR = '[data-test-repeatable-field-remove-item-button]';

const RepeatableFieldItemInteractor = interactor(class RepeatableFieldItemInteractor {
  hasRemoveButton = isPresent(REMOVE_BTN_SELECTOR);
  clickRemoveButton = clickable(REMOVE_BTN_SELECTOR);
  isRemoveDisabled = property(REMOVE_BTN_SELECTOR, 'disabled');
});

export default interactor(class RepeatableFieldInteractor {
  static defaultScope = '[data-test-repeatable-field]';

  id = attribute('id')
  hasAddButton = isPresent(ADD_BTN_SELECTOR);
  addButtonId = attribute(ADD_BTN_SELECTOR, 'id');
  clickAddButton = clickable(ADD_BTN_SELECTOR);
  legend = text('[data-test-repeatable-field-legend]');
  emptyMessage = text('[data-test-repeatable-field-empty-message]');

  isHeadLabelsPresent = isPresent('[data-test-repeatable-field-list-item-labels]');

  items = collection('li', RepeatableFieldItemInteractor);

  isAddDisabled = property('[data-test-repeatable-field-add-item-button]', 'disabled');
});
