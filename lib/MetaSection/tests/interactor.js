/**
 * MetaSection interactor
 */

import { interactor, scoped, isPresent, attribute, text } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class MetaSectionInteractor {
  static defaultScope = '[data-test-meta-section]';

  updatedText = text('div[class^=metaHeader] div[class^=metaHeaderLabel]');
  updatedByText = text('[data-test-updated-by]');
  createdText = text('[data-test-created]');
  createdByText = text('[data-test-created-by]');

  header = scoped('button', ButtonInteractor);

  createdByLinkIsPresent = isPresent('[data-test-created-by] a');
  updatedByLinkIsPresent = isPresent('[data-test-updated-by] a');

  id = attribute('[data-test-accordion-section]', 'id');
  contentId = attribute('[data-test-accordion-wrapper]', 'id');
});
