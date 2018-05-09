import {
  computed,
  Interactor,
  interactor,
  find,
  is,
  isPresent,
  attribute,
  value,
  fillable,
  clickable,
  hasClass,
  text,
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

class CustomInteractor extends Interactor {
  fillAndBlur(val) {
    return this
      .fill(inputClass, val)
      .blur(inputClass);
  }
}

export default interactor(class TextFieldInteractor {
  isInput = is('input', inputClass);
  val = value(inputClass);
  fillInput = fillable(inputClass);
  id = attribute(inputClass, 'id');
  type = attribute(inputClass, 'type');
  labelFor = attribute(labelClass, 'for');
  label = text(labelClass);
  labelRendered = isPresent('label');
  endControl = isPresent(`.${css.endControls} span`)
  ecWidth= find(`.${css.endControls}`).offsetWidth;
  startControl = isPresent(`.${css.startControls} span`);
  scWidth= find(`.${css.startControls}`).offsetWidth;
  inputComputed = computedStyle(inputClass);
  inputReadOnly = attribute(inputClass, 'readonly');
  fillBlurInvalid = new CustomInteractor().fillAndBlur('invalid');
  fillBlurValid = new CustomInteractor().fillAndBlur('valid');
  inputError = isPresent(errorClass);
  hasClearButton = isPresent('#clearField');
  clickClearButton = clickable('#clearField');
  rendersBottomMargin0 = hasClass(rootClass, css.marginBottom0)
});
