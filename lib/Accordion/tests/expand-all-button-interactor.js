import {
  interactor,
  attribute,
  isPresent,
  text,
  clickable,
} from '@bigtest/interactor';

export default interactor(class ExpandAllButtonInteractor {
  defaultScope = 'data-tast-expand-button';
  clickExpandAllButton = clickable('button');
  id = attribute('[data-tast-expand-button]', 'id');
  label = text('[data-tast-expand-button] strong');
  hasButton = isPresent('[data-tast-expand-button]');
});
