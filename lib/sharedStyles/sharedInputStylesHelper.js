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
    const { validationEnabled, meta: { touched, warning, error, dirty, asyncValidating, valid } } = props;
    validationClasses = classNames(
      { [`${formStyles.hasFeedback}`]: validationEnabled && (error || warning) },
      { [`${formStyles.feedbackWarning}`]: validationEnabled && touched && warning },
      { [`${formStyles.feedbackError}`]: validationEnabled && touched && error },
      { [`${formStyles.feedbackValid}`]: validationEnabled && touched && !asyncValidating && valid && dirty },
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
