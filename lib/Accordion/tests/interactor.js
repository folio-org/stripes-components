import {
  interactor,
  clickable,
  collection,
  hasClass,
  is,
  scoped,
  triggerable,
  focusable,
  property,
  attribute,
  text,
} from '@bigtest/interactor';

import css from '../Accordion.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const triggerCollapse = selectorFromClassnameString(`.${css.defaultCollapseButton}`);

export const AccordionInteractor = interactor(class AccordionInteractor {
  static defaultScope = `.${css.accordion}`

  label = text(`.${css.labelArea}`)
  isOpen = hasClass(`.${css.content}`, css.expanded)
  contentHeight = property(`.${css.content}`, 'offsetHeight')
  clickHeader = clickable(triggerCollapse)
  id = attribute('[data-test-accordion-wrapper]', 'id')
  accordions = scoped(triggerCollapse, {
    gotoNext: triggerable('keydown', { keyCode: 40 }), // down arrow
    gotoPrevious: triggerable('keydown', { keyCode: 38 }), // up arrow
    gotoLast: triggerable('keydown', { keyCode: 35 }), // end key
    gotoFirst: triggerable('keydown', { keyCode: 36 }), // home key
    pressTab: triggerable('keydown', { keyCode: 9 }), // tab
    focusTrigger: focusable(),
    isFocused: is(':focus'),
  });
});

export const AccordionSetInteractor = interactor(class AccordionSetInteractor {
  static defaultScope = '#testSet';
  set = collection('section', AccordionInteractor)
  tablist = is('[role="tablist"]')
  id = attribute('id')
});
