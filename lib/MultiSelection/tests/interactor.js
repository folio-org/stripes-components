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
} from '@bigtest/interactor';

import css from '../MultiSelect.css';
import formCss from '../../sharedStyles/form.css';

import { selectorFromClassnameString } from '../../../tests/helpers';

const errorClass = selectorFromClassnameString(`.${formCss.feedbackError}`);
const warningClass = selectorFromClassnameString(`.${formCss.feedbackWarning}`);
const filterClass = selectorFromClassnameString(`.${css.multiSelectInput}`);
const emptyClass = selectorFromClassnameString(`.${css.multiSelectEmptyMessage}`);

const OptionInteractor = interactor(class OptionInteractor {
  clickOption = clickable(`li`);
  isCursored = hasClass(css.optionCursor);
  id = attribute('id');
});

const ValueChipInteractor = interactor(class OptionInteractor {
  defaultScope = `.${css.valueChipRoot}`;
  clickRemoveButton = clickable('button');
  isFocused = is('button', ':focused');
  valLabel = text(`.${css.valueChipValue}`);
  id = attribute('id');
});

export default interactor(class SingleSelectInteractor {
  defaultScope = `.${css.multiSelectContainer}`
  controlPresent = isPresent(`.${css.multiSelectContainer}`);
  filterIsFocused = is(filterClass, ':focus');
  containerId = attribute(`.${css.multiSelectContainer}`, 'id');
  options = collection(`.${css.multiSelectOption}`, OptionInteractor);
  values = collection(`.${css.valueChipRoot}`, ValueChipInteractor );
  emptyMessagePresent = isPresent(emptyClass);

  // aria-attributes
  containerAriaLabelledBy = attribute(`.${css.multiSelectContainer}`, 'aria-labelledby');
  popupAttribute = attribute(`.${css.multiSelectToggleButton}`, 'aria-haspopup');
  filterRole = attribute(filterClass, 'role');
  filterActiveDescendant = attribute(filterClass, 'aria-activedescendant');
  listPresent = isPresent(`.${css.multiSelectMenu}`);
  listHiddenAttributeSet = property(`.${css.multiSelectMenu}`, 'hidden');
  optionCount = count(`.${css.multiSelectOptionList} li`);

  // label
  label = text('label');
  labelRendered = isPresent('label');

  // classes/styles
  inputError = isPresent(errorClass);
  inputWarning = isPresent(warningClass);
  rendersBottomMargin0 = hasClass(`.${css.multiSelectControl}`, css.marginBottom0);
  hasWarningStyle = hasClass(`.${css.multiSelectControl}`, formCss.hasWarning);
  hasErrorStyle = hasClass(`.${css.multiSelectControl}`, formCss.hasError);
  hasChangedStyle = hasClass(`.${css.multiSelectControl}`, formCss.isChanged);
  hasValidStyle = hasClass(`.${css.multiSelectControl}`, formCss.isValid);

  // behaviors
  clickControl = clickable(`.${css.multiSelectControl}`);
  fillFilter = fillable(filterClass);
  focusFilter = focusable(filterClass);
  focusControl = focusable(`.${css.multiSelectControl}`);

  // css index of elements is one-based
  clickOption(index) {
    return this.click(`li:nth-of-type(${index}`);
  }
  expandAndClick(index) {
    return this
      .click('button')
      .click(`li:nth-of-type(${index}`)
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
});
