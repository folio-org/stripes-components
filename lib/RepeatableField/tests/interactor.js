import {
  clickable,
  collection,
  interactor,
  isPresent,
  text
} from '@bigtest/interactor';

const RepeatableFieldItemInteractor = interactor(class RepeatableFieldItemInteractor {
  clickRemoveButton = clickable('[data-test-repeatable-field-remove-item-button]')
});

export default interactor(class RepeatableFieldInteractor {
  static defaultScope = '[data-test-repeatable-field]';

  hasAddButton = isPresent('[data-test-repeatable-field-add-item-button]');
  clickAddButton = clickable('[data-test-repeatable-field-add-item-button]');
  legend = text('[data-test-repeatable-field-legend]');
  emptyMessage = text('[data-test-repeatable-field-empty-message]');

  items = collection('li', RepeatableFieldItemInteractor);
});
