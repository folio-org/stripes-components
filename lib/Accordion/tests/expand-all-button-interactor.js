import {
  interactor,
  attribute,
  isPresent,
  text,
  clickable,
} from '@bigtest/interactor';

export default interactor(class ExpandAllButtonInteractor {
  defaultScope = 'data-test-expand-button';
  clickExpandAllButton = clickable('button');
  id = attribute('[data-test-expand-button]', 'id');
  label = text('[data-test-expand-button] strong');
  hasButton = isPresent('[data-test-expand-button]');
});
