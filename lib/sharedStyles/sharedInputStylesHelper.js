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

export default ({ meta, ...props }) => {
  // Validation classes
  let validationClasses = null;
  const {
    validationEnabled,
    validStylesEnabled,
    touched,
    warning,
    error,
    dirty,
    asyncValidating,
    valid
  } = { ...meta, ...props };

  const hasError = validationEnabled && touched && error;
  const isValid = validationEnabled && validStylesEnabled && touched && !asyncValidating && valid && dirty;
  const hasWarning = validationEnabled && touched && warning;
  const hasFeedback = validationEnabled && (error || warning);
  validationClasses = classNames(
    { [`${formStyles.isChanged}`]: dirty && !hasError && !hasWarning && !isValid },
    { [`${formStyles.hasWarning}`]: hasWarning },
    { [`${formStyles.hasError}`]: hasError },
    { [`${formStyles.isValid}`]: isValid },
    { [`${formStyles.hasFeedback}`]: hasFeedback },
  );

  // Other input classes
  return classNames(
    formStyles.input,
    { [`${formStyles.noBorder}`]: props.noBorder },
    { [`${formStyles.marginBottom0}`]: props.marginBottom0 },
    validationClasses,
  );
};
