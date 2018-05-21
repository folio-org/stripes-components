/**
 * Shared Input Style Helper
 *
 * A shared input classes helper for adding
 * common input class names across input, textarea and select fields.
 *
 * It also adds validation classes that uses
 * the meta prop which is injected by redux-form
 */

import classNames from 'classnames';
import formStyles from './form.css';

export default (props) => {
  // Validation classes
  let validationClasses = null;
  if (typeof props.meta !== 'undefined') {
    const { validationEnabled, validStylesEnabled, meta: { touched, warning, error, dirty, asyncValidating, valid } } = props;
    const hasError = validationEnabled && touched && error;
    const isValid = validationEnabled && validStylesEnabled && touched && !asyncValidating && valid && dirty;
    const hasWarning = validationEnabled && touched && warning;
    const hasFeedback = validationEnabled && (error || warning);
    validationClasses = classNames(
      { [`${formStyles.feedbackChanged}`]: dirty && !hasError && !hasWarning && !isValid },
      { [`${formStyles.feedbackWarning}`]: hasWarning },
      { [`${formStyles.feedbackError}`]: hasError },
      { [`${formStyles.feedbackValid}`]: isValid },
      { [`${formStyles.hasFeedback}`]: hasFeedback },
    );
  }

  // Other input classes
  return classNames(
    formStyles.input,
    { [`${formStyles.noBorder}`]: props.noBorder },
    { [`${formStyles.marginBottom0}`]: props.marginBottom0 },
    validationClasses,
  );
};
