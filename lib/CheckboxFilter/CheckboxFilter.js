import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Checkbox';

export default class CheckboxFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      label: PropTypes.node,
      readOnly: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  };

  static defaultProps = {
    selectedValues: [],
  }

  createOnChangeHandler = (filterValue) => (e) => {
    const {
      name,
      selectedValues,
      onChange,
    } = this.props;

    const newValues = e.target.checked
      ? [...selectedValues, filterValue]
      : selectedValues.filter((value) => value !== filterValue);

    onChange({
      name,
      values: newValues,
    });
  };

  render() {
    const {
      options,
      selectedValues,
    } = this.props;

    return (
      options.map(({ value, label, disabled, readOnly }) => {
        return (
          <Checkbox
            {...this.props}
            data-test-checkbox-filter-option={value}
            key={value}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            checked={selectedValues.includes(value)}
            onChange={this.createOnChangeHandler(value)}
          />
        );
      })
    );
  }
}
