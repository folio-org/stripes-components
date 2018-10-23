/**
 * Shared Input Style Helper
 *
 * A shared input classes helper for adding
 * common input class names across input, textarea and select fields.
 *
 */

import classNames from 'classnames';
import formStyles from './form.css';

export default (props) => {
  // Validation classes
  let validationClasses = null;
  const {
    dirty,
    error,
    marginBottom0,
    noBorder,
    valid,
    validationEnabled,
    validStylesEnabled,
    warning
  } = props;

  const hasError = validationEnabled && error;
  const isValid = validationEnabled && validStylesEnabled && valid;
  const hasWarning = validationEnabled && warning;
  const hasFeedback = validationEnabled && (error || warning);
  validationClasses = classNames(
    { [`${formStyles.isChanged}`]: dirty && !hasError && !hasWarning && !isValid },
    { [`${formStyles.hasWarning}`]: hasWarning },
    { [`${formStyles.hasError}`]: hasError },
    { [`${formStyles.isValid}`]: isValid },
    { [`${formStyles.hasFeedback}`]: hasFeedback },
    { [`${formStyles.readOnly}`]: props.readOnly },
    { [`${formStyles.disabled}`]: props.disabled },
  );

  // Other input classes
  return classNames(
    formStyles.formControl,
    { [`${formStyles.noBorder}`]: noBorder },
    { [`${formStyles.marginBottom0}`]: marginBottom0 },
    validationClasses,
  );
};
