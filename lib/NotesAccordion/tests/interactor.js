import {
  interactor,
  isPresent,
  text,
  collection,
  clickable,
} from '@bigtest/interactor';

const dataAttributePrefix = 'data-test-notes-accordion';

@interactor class NotesListItemInteractor {
  defaultScope = `${dataAttributePrefix}-list-item`;
}

@interactor class NotesListInteractor {
  defaultScope = '#notes-list';
  items = collection('li', NotesListItemInteractor);
}

export default interactor(class NotesAccordionInteractor {
  defaultScope = '[data-test-notes-accordion]';
  exists = isPresent('#notes-accordion');
  quantityIndicator = text(`[${dataAttributePrefix}-quantity-indicator]`);
  hasAccordionHeader = isPresent(`[${dataAttributePrefix}-header]`);
  hasAddButton = isPresent(`[${dataAttributePrefix}-add-button]`);
  hasNewButton = isPresent(`[${dataAttributePrefix}-new-button]`);
  hasEmptyMessage = isPresent(`[${dataAttributePrefix}-empty-message]`);
  notesList = new NotesListInteractor();
  clickOnNewButton = clickable(`[${dataAttributePrefix}-new-button]`);
});
