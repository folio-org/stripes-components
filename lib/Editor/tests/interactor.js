import {
  attribute,
  hasClass,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import formCss from '../../sharedStyles/form.css';

export default interactor(class TextAreaInteractor {
  hasEditor = isPresent('.quill');
  id = attribute('.quill', 'id');
  label = text('label');
  hasLabel = isPresent('label');
  errorText = text('[class*=feedbackError---]');
  warningText = text('[class*=feedbackWarning---]');
  hasWarningStyle = hasClass('.quill', formCss.hasWarning);
  hasErrorStyle = hasClass('.quill', formCss.hasError);
  hasValidStyle = hasClass('.quill', formCss.isValid);
});
