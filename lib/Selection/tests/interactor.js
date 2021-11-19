import {
  attribute,
  property,
  clickable,
  fillable,
  focusable,
  hasClass,
  collection,
  interactor,
  is,
  isPresent,
  text,
  count,
  scoped,
} from '@bigtest/interactor';

import css from '../Selection.css';
import formCss from '../../sharedStyles/form.css';


const errorClass = '[class*=feedbackError---]';
const warningClass = '[class*=feedbackWarning---]';
const filterClass = '[class*=selectionFilter---]';

const OptionInteractor = interactor(class OptionInteractor {
  isCursored = hasClass(css.cursor);
  id = attribute('id');
  hasStartAlignment = hasClass(css.optionStart);
  hasEndAlignment = hasClass(css.optionEnd);
  hasCenterAlignment = hasClass(css.optionCentered);
  hasOutsideAlignment = hasClass(css.optionOutside);
});

const SelectionListRootInteractor = interactor(class SelectionListRootInteractor {
  options = collection('[class^="option--"]', {
    click: clickable(),
  });

  clickOption(index) {
    return this.options(index).click();
  }
});

export const OptionSegmentInteractor = interactor(class OptionSegmentInteractor {
  static defaultScope = '[data-test-selection-option-segment]';
});

export default interactor(class SingleSelectInteractor {
  controlPresent = isPresent('[class*=selectionControlContainer---]');
  filterFocused = is(filterClass, ':focus');
  valLabel = text('[class*=singleValue---]');
  isFocused = is('button', ':focus');
  controlId = attribute('button', 'id');
  options = collection('li', OptionInteractor);
  alertMessage = scoped('[class*=selectionAlertMessage---]', {
    messageText: text(),
  });

  selectionListRoot = new SelectionListRootInteractor('[class^="selectionListRoot--"]');

  // aria-attributes
  ariaLabelledBy = attribute('button', 'aria-labelledby');
  popupAttribute = attribute('button', 'aria-haspopup');
  expandedAttribute = attribute('button', 'aria-expanded');
  filterRole = attribute(filterClass, 'role');
  filterActiveDescendant = attribute(filterClass, 'aria-activedescendant');
  listPresent = isPresent('[class*=selectionListRoot---]');
  listHiddenAttributeSet = property('[class*=selectionListRoot---]', 'hidden');
  optionCount = count('li');

  // label
  label = text('label');
  labelRendered = isPresent('label');
  inputError = isPresent(errorClass);
  inputWarning = isPresent(warningClass);
  rendersBottomMargin0 = hasClass('button', css.marginBottom0);
  hasWarningStyle = hasClass('button', formCss.hasWarning);
  hasErrorStyle = hasClass('button', formCss.hasError);
  hasChangedStyle = hasClass('button', formCss.isChanged);
  hasValidStyle = hasClass('button', formCss.isValid);

  // behaviors
  clickControl = clickable('button');
  fillFilter = fillable('input');
  focusFilter = focusable('input');
  focusControl = focusable('button');

  // css index of elements is one-based
  clickOption(index) {
    return this.selectionListRoot.clickOption(index);
  }

  expandAndClick(index) {
    return this
      .click('button')
      .selectionListRoot.clickOption(index)
      .blur('button');
  }

  expandAndFilter(value) {
    return this
      .click('button')
      .fill('input', value);
  }

  moveToNextOption(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 40 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 40 });
  }

  moveToPreviousOption(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 38 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 38 });
  }

  pressEnter(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 13 });
    }
    return this.trigger(sel, 'keydown', { keyCode: 13 });
  }

  pressKey(sel, keyCode, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode });
    }
    return this.trigger(sel, 'keydown', { keyCode });
  }
});
