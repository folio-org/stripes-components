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
    const { touched, warning, error, dirty, asyncValidating, valid } = props.meta;
    validationClasses = classNames(
      { [`${formStyles.hasFeedback}`]: error || warning },
      { [`${formStyles.feedbackWarning}`]: touched && warning },
      { [`${formStyles.feedbackError}`]: touched && error },
      { [`${formStyles.feedbackValid}`]: touched && !asyncValidating && valid && dirty },
    );
  }

  // Other input classes
  return classNames(
    formStyles.input,
    { [`${formStyles.rounded}`]: props.rounded },
    { [`${formStyles.noBorder}`]: props.noBorder },
    { [`${formStyles.marginBottom0}`]: props.marginBottom0 },
    validationClasses,
  );
};
