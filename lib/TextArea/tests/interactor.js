import {
  attribute,
  blurrable,
  fillable,
  focusable,
  hasClass,
  interactor,
  is,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import formCss from '../../sharedStyles/form.css';

export default interactor(class TextAreaInteractor {
  hasTextArea = isPresent('textarea');
  isFocused = is('textarea', ':focus');
  val = value('textarea');
  fillTextArea = fillable('textarea');
  blurTextArea = blurrable('textarea');
  focusTextArea = focusable('textarea');
  id = attribute('textarea', 'id');
  labelFor = attribute('label', 'for');
  label = text('label');
  hasLabel = isPresent('label');
  errorText = text('[class*=feedbackError---]');
  warningText = text('[class*=feedbackWarning---]');
  hasWarningStyle = hasClass('textarea', formCss.hasWarning);
  hasErrorStyle = hasClass('textarea', formCss.hasError);
  hasChangedStyle = hasClass('textarea', formCss.isChanged);
  hasValidStyle = hasClass('textarea', formCss.isValid);
  hasLoadingIcon = isPresent('[class*=loadingIcon---]');

  fillAndBlur(val) {
    return this
      .fill('textarea', val)
      .blur('textarea');
  }
});
