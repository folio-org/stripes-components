import {
  attribute,
  property,
  clickable,
  triggerable,
  fillable,
  focusable,
  hasClass,
  collection,
  interactor,
  is,
  isPresent,
  text,
  count,
  value,
} from '@bigtest/interactor';

import SelectionCss from '../../Selection/Selection.css';
import css from '../MultiSelect.css';
import formCss from '../../sharedStyles/form.css';
import iconCss from '../../Icon/DotSpinner.css';

import { selectorFromClassnameString } from '../../../tests/helpers';

const optionClass = selectorFromClassnameString(`.${css.multiSelectOption}`);
const controlClass = selectorFromClassnameString(`.${css.multiSelectControl}`);
const menuClass = selectorFromClassnameString(`.${css.multiSelectMenu}`);
const errorClass = selectorFromClassnameString(`.${formCss.feedbackError}`);
const warningClass = selectorFromClassnameString(`.${formCss.feedbackWarning}`);
const filterClass = selectorFromClassnameString(`.${css.multiSelectFilterField}`);
const emptyClass = selectorFromClassnameString(`.${css.multiSelectEmptyMessage}`);
const inputClass = selectorFromClassnameString(`.${css.multiSelectValueInput}`);

const OptionInteractor = interactor(class OptionInteractor {
  defaultScope = optionClass;
  clickOption = clickable();
  label = text('li *:first-child');
  isCursored = hasClass(css.optionCursor);
  isSelected = hasClass(SelectionCss.selected);
  id = attribute('id');
});

const ValueChipInteractor = interactor(class ValueChipInteractor {
  defaultScope = `.${css.valueChipRoot}`;
  clickRemoveButton = clickable('button');
  isFocused = is('button', ':focus');
  valLabel = text(`.${css.valueChipValue}`);
  focusRemoveButton = focusable('button');
  pressHome = triggerable('button', 'keydown', { keyCode: 36, key: 'Home' });
  pressEnd = triggerable('button', 'keydown', { keyCode: 35, key: 'End' });
  id = attribute('id');
});

export default interactor(class MultiSelectInteractor {
  defaultScope = `.${css.multiSelectContainer}`
  controlPresent = isPresent(`.${css.multiSelectContainer}`);
  controlIsFocused = is(controlClass, ':focus');
  filterIsFocused = is(filterClass, ':focus');
  containerId = attribute(`.${css.multiSelectContainer}`, 'id');
  options = collection(optionClass, OptionInteractor);
  values = collection(`.${css.valueChipRoot}`, ValueChipInteractor);
  emptyMessagePresent = isPresent(emptyClass);
  filterPlaceholder = attribute(filterClass, 'placeholder');
  loaderPresent = isPresent(`.${iconCss.spinner}`);
  inputValue = value(inputClass);

  // aria-attributes
  controlAriaLabelledBy = attribute(controlClass, 'aria-labelledby');
  popupAttribute = attribute(`.${css.multiSelectToggleButton}`, 'aria-haspopup');
  filterRole = attribute(filterClass, 'role');
  filterActiveDescendant = attribute(filterClass, 'aria-activedescendant');
  listPresent = isPresent(`.${css.multiSelectMenu}`);
  listHiddenAttributeSet = property(menuClass, 'hidden');
  optionCount = count(`.${css.multiSelectOptionList} li`);
  valueCount = count(`.${css.valueChipRoot}`);

  // label
  label = text('label');
  labelRendered = isPresent('label');

  // classes/styles
  inputError = isPresent(errorClass);
  inputWarning = isPresent(warningClass);
  rendersBottomMargin0 = hasClass(controlClass, css.marginBottom0);
  hasWarningStyle = hasClass(controlClass, formCss.hasWarning);
  hasErrorStyle = hasClass(controlClass, formCss.hasError);
  hasChangedStyle = hasClass(controlClass, formCss.isChanged);
  hasValidStyle = hasClass(controlClass, formCss.isValid);

  errorMessageInMenu = isPresent(`${menuClass} ${errorClass}`);
  warningMessageInMenu = isPresent(`${menuClass} ${warningClass}`);

  // behaviors
  clickControl = clickable(controlClass);
  clickToggleButton = clickable(`.${css.multiSelectToggleButton}`);
  fillFilter = fillable(filterClass);
  focusFilter = focusable(filterClass);
  focusControl = focusable(controlClass);

  // css index of elements is one-based
  clickOption(index) {
    return this.click(`li:nth-of-type(${index})`);
  }

  expandAndClick(index) {
    return this
      .click('button')
      .click(`li:nth-of-type(${index}`);
  }

  expandAndFilter(fieldValue) {
    return this
      .click('button')
      .fill('input', fieldValue);
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

  pressHome(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 36, key: 'Home' });
    }
    return this.trigger(sel, 'keydown', { keyCode: 36, key: 'Home' });
  }

  pressEnd(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 35, key: 'End' });
    }
    return this.trigger(sel, 'keydown', { keyCode: 35, key: 'End' });
  }

  pressBackspace(sel, setFocus = false) {
    if (setFocus) {
      return this
        .focus(sel)
        .trigger(sel, 'keydown', { keyCode: 8, key: 'Backspace' });
    }
    return this.trigger(sel, 'keydown', { keyCode: 8, key: 'Backspace' });
  }
});
