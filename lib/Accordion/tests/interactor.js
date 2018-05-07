import {
  interactor,
  clickable,
  hasClass,
  property,
  text
} from '@bigtest/interactor';

import css from '../Accordion.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const triggerCollapse = selectorFromClassnameString(`.${css.defaultCollapseButton}`);

export default interactor(class AccordionInteractor {
  static defaultScope = `.${css.accordion}`

  label = text(`.${css.labelArea}`)
  isOpen = hasClass(`.${css.content}`, css.expanded)
  contentHeight = property(`.${css.content}`, 'offsetHeight')
  clickHeader = clickable(triggerCollapse)
});
