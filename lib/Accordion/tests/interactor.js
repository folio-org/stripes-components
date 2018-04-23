import {
  interactor,
  clickable,
  hasClass,
  property,
  text
} from '@bigtest/interaction';

import css from '../Accordion.css';

export default interactor(class AccordionInteractor {
  static defaultScope = `.${css.accordion}`

  label = text(`.${css.labelArea}`)
  isOpen = hasClass(`.${css.content}`, css.expanded)
  contentHeight = property(`.${css.content}`, 'offsetHeight')
  clickHeader = clickable(`.${css.defaultCollapseButton}`)
});
