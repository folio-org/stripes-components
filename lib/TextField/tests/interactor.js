import {
  computed,
  interactor,
  find,
  is,
  isPresent,
  attribute,
  value,
  fillable,
  hasClass,
  text,
} from '@bigtest/interactor';

import css from '../TextField.css';
import formCss from '../../sharedStyles/form.css';

// import { selectorFromClassnameString } from '../../../tests/helpers';

const inputClass = `.${formCss.input}`;
const labelClass = `.${formCss.label}`;
const rootClass = `.${css.textField}`;

function computedStyle(selector) {
  return computed(function () {
    return getComputedStyle(this.$(selector));
  });
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
  rendersBottomMargin0 = hasClass(rootClass, css.marginBottom0)
});
