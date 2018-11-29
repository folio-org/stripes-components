import React from 'react';
import PropTypes from 'prop-types';
import ReduxFormField from '../ReduxFormField';
import css from './RadioButtonGroup.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  warning: PropTypes.string
};

function RadioButtonGroup(props) {
  const { error, label, onBlur, onChange, onFocus, value, warning, ...rest } = props;

  const displayedChildren = React.Children.map(props.children,
    (child) => {
      if (value !== undefined) {
        return React.cloneElement(child, {
          checked: value.toString() === child.props.value,
          marginBottom0: true,
          onBlur,
          onChange,
          onFocus
        });
      } else {
        return child;
      }
    });

  const warningElement = warning ? <div className={css.groupWarning}>{warning}</div> : null;
  const errorElement = error ? <div className={css.groupError}>{error}</div> : null;

  return (
    <fieldset className={css.groupRoot} {...rest}>
      <legend className={css.groupLabel}>{label}</legend>
      {displayedChildren}
      <div role="alert">
        {warningElement}
        {errorElement}
      </div>
    </fieldset>
  );
}

RadioButtonGroup.propTypes = propTypes;

export default ReduxFormField(
  RadioButtonGroup,
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched && meta.warning ? meta.warning : '')
  })
);
