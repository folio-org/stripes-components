import {
  attribute,
  blurrable,
  clickable,
  computed,
  fillable,
  find,
  focusable,
  hasClass,
  interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import css from '../TextField.css';
import formCss from '../../sharedStyles/form.css';

import { selectorFromClassnameString } from '../../../tests/helpers';

const rootClass = `.${css.textField}`;
const errorClass = selectorFromClassnameString(`.${formCss.feedbackError}`);
const groupClass = `.${css.inputGroup}`;

function computedStyle(selector) {
  return computed(function () {
    return getComputedStyle(this.$(selector));
  });
}

export default interactor(class TextFieldInteractor {
  isFocused = hasClass(groupClass, formCss.isFocused);
  val = value('input');
  fillInput = fillable('input');
  blurInput = blurrable('input');
  focusInput = focusable('input');
  id = attribute('input', 'id');
  type = attribute('input', 'type');
  labelFor = attribute('label', 'for');
  label = text('label');
  labelRendered = isPresent('label');
  endControl = isPresent(`.${css.endControls} span`)
  endControlsWidth= find(`.${css.endControls}`).offsetWidth;
  startControl = isPresent(`.${css.startControls} span`);
  startControlsWidth= find(`.${css.startControls}`).offsetWidth;
  inputComputed = computedStyle('input');
  inputReadOnly = attribute('input', 'readonly');
  inputError = isPresent(errorClass);
  hasClearButton = isPresent('#clearField');
  clickClearButton = clickable('#clearField');
  rendersBottomMargin0 = hasClass(rootClass, css.marginBottom0);
  hasWarningStyle = hasClass(groupClass, formCss.hasWarning);
  hasErrorStyle = hasClass(groupClass, formCss.hasError);
  hasChangedStyle = hasClass(groupClass, formCss.isChanged);
  hasValidStyle = hasClass(groupClass, formCss.isValid);
  hasLoadingIcon = isPresent(`.${css.loadingIcon}`);

  fillAndBlur(val) {
    return this
      .fill('input', val)
      .blur('input');
  }
});
