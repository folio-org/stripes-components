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

const optionClass = '[class*=multiSelectOption---]';
const controlClass = '[class*=multiSelectControl---]';
const menuClass = '[class*=multiSelectMenu---]';
const errorClass = '[class*=feedbackError---]';
const warningClass = '[class*=feedbackWarning---]';
const filterClass = '[class*=multiSelectFilterField---]';
const emptyClass = '[class*=multiSelectEmptyMessage---]';
const inputClass = '[class*=multiSelectValueInput---]';

const OptionInteractor = interactor(class OptionInteractor {
  defaultScope = optionClass;
  clickOption = clickable();
  label = text('li *:first-child');
  isCursored = hasClass(css.optionCursor);
  isSelected = hasClass(SelectionCss.selected);
  id = attribute('id');
});

const ValueChipInteractor = interactor(class ValueChipInteractor {
  defaultScope = '[class*=valueChipRoot---]';
  clickRemoveButton = clickable('button');
  isFocused = is('button', ':focus');
  valLabel = text('[class*=valueChipValue---]');
  focusRemoveButton = focusable('button');
  pressHome = triggerable('button', 'keydown', { keyCode: 36, key: 'Home' });
  pressEnd = triggerable('button', 'keydown', { keyCode: 35, key: 'End' });
  id = attribute('id');
});

export default interactor(class MultiSelectInteractor {
  defaultScope = '[class*=multiSelectContainer---]'
  controlPresent = isPresent('[class*=multiSelectContainer---]');
  controlIsFocused = is(controlClass, ':focus');
  filterIsFocused = is(filterClass, ':focus');
  containerId = attribute('[class*=multiSelectContainer---]', 'id');
  options = collection(optionClass, OptionInteractor);
  values = collection('[class*=valueChipRoot---]', ValueChipInteractor);
  emptyMessagePresent = isPresent(emptyClass);
  filterPlaceholder = attribute(filterClass, 'placeholder');
  loaderPresent = isPresent(`.${iconCss.spinner}`);
  inputValue = value(inputClass);

  // aria-attributes
  filterInputAriaLabelledBy = attribute(filterClass, 'aria-labelledby');
  controlAriaLabelledBy = attribute(controlClass, 'aria-labelledby');
  popupAttribute = attribute('[class*=multiSelectToggleButton---]', 'aria-haspopup');
  filterRole = attribute(filterClass, 'role');
  filterActiveDescendant = attribute(filterClass, 'aria-activedescendant');
  listPresent = isPresent('[class*=multiSelectMenu---]');
  listHiddenAttributeSet = property(menuClass, 'hidden');
  optionCount = count('[class*=multiSelectOptionList---] li');
  valueCount = count('[class*=valueChipRoot---]');

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
  clickToggleButton = clickable('[class*=multiSelectToggleButton---]');
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
