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
  is,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import css from '../TextField.css';
import formCss from '../../sharedStyles/form.css';

import { selectorFromClassnameString } from '../../../tests/helpers';

const inputClass = `.${formCss.input}`;
const labelClass = `.${formCss.label}`;
const rootClass = `.${css.textField}`;
const errorClass = selectorFromClassnameString(`.${formCss.feedbackError}`);

function computedStyle(selector) {
  return computed(function () {
    return getComputedStyle(this.$(selector));
  });
}

export default interactor(class TextFieldInteractor {
  isInput = is('input', inputClass);
  val = value(inputClass);
  fillInput = fillable(inputClass);
  blurInput = blurrable(inputClass);
  focusInput = focusable(inputClass);
  id = attribute(inputClass, 'id');
  type = attribute(inputClass, 'type');
  labelFor = attribute(labelClass, 'for');
  label = text(labelClass);
  labelRendered = isPresent('label');
  endControl = isPresent(`.${css.endControls} span`)
  endControlsWidth= find(`.${css.endControls}`).offsetWidth;
  startControl = isPresent(`.${css.startControls} span`);
  startControlsWidth= find(`.${css.startControls}`).offsetWidth;
  inputComputed = computedStyle(inputClass);
  inputReadOnly = attribute(inputClass, 'readonly');
  inputError = isPresent(errorClass);
  hasClearButton = isPresent('#clearField');
  clickClearButton = clickable('#clearField');
  rendersBottomMargin0 = hasClass(rootClass, css.marginBottom0);
  hasWarningStyle = hasClass('input', formCss.feedbackWarning);
  hasErrorStyle = hasClass('input', formCss.feedbackError);
  hasChangedStyle = hasClass('input', formCss.feedbackChanged);
  hasValidStyle = hasClass('input', formCss.feedbackValid);

  fillAndBlur(val) {
    return this
      .fill(inputClass, val)
      .blur(inputClass);
  }
});
