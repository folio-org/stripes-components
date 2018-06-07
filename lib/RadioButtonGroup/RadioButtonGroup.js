import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from '../RadioButton';
import css from './RadioButtonGroup.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  selectedValue: PropTypes.string,
};

function RadioButtonGroup(props) {
  const { input, meta: { touched, error, warning }, ...rest } = props;
  const { value, ...inputAttr } = input;

  const selected = props.selectedValue || value;

  const { label, ...inputCustom } = { ...rest };
  const displayedChildren = React.Children.map(props.children,
    (child) => {
      if (child.type !== RadioButton) { return child; }
      const newProps = { ...inputAttr, ...inputCustom };
      newProps.checked = selected.toString() === child.props.value;
      newProps.marginBottom0 = true;
      const elemProps = Object.assign({}, newProps, child.props);
      return React.cloneElement(child, elemProps, []);
    });

  const warningElement = touched && warning ? <div className={css.groupWarning}>{warning}</div> : null;
  const errorElement = touched && error ? <div className={css.groupError}>{error}</div> : null;

  return (
    <div className={css.groupRoot}>
      <fieldset>
        <legend className={css.groupLabel}>{label}</legend>
        {displayedChildren}
        {warningElement}
        {errorElement}
      </fieldset>
    </div>
  );
}

RadioButtonGroup.propTypes = propTypes;

export default RadioButtonGroup;
