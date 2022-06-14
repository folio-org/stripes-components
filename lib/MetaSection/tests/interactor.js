/**
 * MetaSection interactor
 */

import { interactor, scoped, isPresent, text } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';
import { AccordionInteractor } from '../../Accordion/tests/interactor';

export default interactor(class MetaSectionInteractor {
  static defaultScope = '[data-test-meta-section]';

  updatedText = text('div[class^=metaHeader] div[class^=metaHeaderLabel]');
  updatedTextIsPresent = isPresent('div[class^=metaHeader] div[class^=metaHeaderLabel]');
  updatedByText = text('[data-test-updated-by]');
  updatedByTextIsPresent = isPresent('[data-test-updated-by]');
  createdText = text('[data-test-created]');
  createdTextIsPresent = isPresent('[data-test-created]');
  createdByText = text('[data-test-created-by]');
  createdByTextIsPresent = isPresent('[data-test-created-by]');

  header = scoped('button', ButtonInteractor);
  accordion = scoped(AccordionInteractor.defaultScope, AccordionInteractor);

  createdByLinkIsPresent = isPresent('[data-test-created-by] a');
  updatedByLinkIsPresent = isPresent('[data-test-updated-by] a');
});
