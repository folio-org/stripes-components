import {
  attribute,
  blurrable,
  focusable,
  hasClass,
  interactor,
  is,
  isPresent,
  selectable,
  text,
  value,
} from '@bigtest/interactor';

import css from '../Select.css';
import formCss from '../../sharedStyles/form.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

export default interactor(class SelectInteractor {
  hasSelect = isPresent('select');
  isFocused = is('select', ':focus');
  val = value('select');
  selectOption = selectable('select');
  blurSelect = blurrable('select');
  focusSelect = focusable('select');
  id = attribute('select', 'id');
  labelFor = attribute('label', 'for');
  label = text('label');
  hasLabel = isPresent('label');
  labelHidden = hasClass('label', 'sr-only');
  ariaLabelledby = attribute('select', 'aria-labelledby');
  errorText = text(selectorFromClassnameString(`.${formCss.feedbackError}`));
  warningText = text(selectorFromClassnameString(`.${formCss.feedbackWarning}`));
  hasWarningStyle = hasClass('select', formCss.hasWarning);
  hasErrorStyle = hasClass('select', formCss.hasError);
  hasChangedStyle = hasClass('select', formCss.isChanged);
  hasValidStyle = hasClass('select', formCss.isValid);
  hasLoadingIcon = isPresent(`.${css.loadingIcon}`);

  selectAndBlur(val) {
    return this
      .selectOption(val)
      .blur('select');
  }
});
