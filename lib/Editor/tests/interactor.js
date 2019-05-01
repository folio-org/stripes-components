import {
  attribute,
  hasClass,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import formCss from '../../sharedStyles/form.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

export default interactor(class TextAreaInteractor {
  hasEditor = isPresent('.quill');
  id = attribute('.quill', 'id');
  label = text('label');
  hasLabel = isPresent('label');
  errorText = text(selectorFromClassnameString(`.${formCss.feedbackError}`));
  warningText = text(selectorFromClassnameString(`.${formCss.feedbackWarning}`));
  hasWarningStyle = hasClass('.quill', formCss.hasWarning);
  hasErrorStyle = hasClass('.quill', formCss.hasError);
  hasValidStyle = hasClass('.quill', formCss.isValid);
});
